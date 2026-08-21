# app.py
#
# TODO:
# - Revisit regex word boundaries, create issue to change notebook to use the json file as well
# - Fix issues with categories descriptions - Climate, Pets, Parks & Green Spaces
#
import modal
import csv
import json
import os
import re

import torch

app = modal.App("civic-dashboard-categorize-subject-terms")

MODEL_ID = "MoritzLaurer/deberta-v3-large-zeroshot-v2.0"
HYPOTHESIS_TEMPLATE = "In Toronto municipal government, this topic relates to {}."

# ── Image ─────────────────────────────────────────────────────────────────────

def download_model():
    from transformers import pipeline
    pipeline("zero-shot-classification", model=MODEL_ID)

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("transformers[torch]==4.44.0", "torch==2.5.1")
    .run_function(download_model)
)

# ── Classifier ────────────────────────────────────────────────────────────────

def estimate_batch_size() -> int:
    free_bytes, _ = torch.cuda.mem_get_info()
    free_gb = free_bytes / (1024 ** 3)
    return min(max(int(free_gb * 1024 / 50), 8), 128)


@app.cls(image=image, gpu="T4", scaledown_window=120)
class Classifier:

    @modal.enter()
    def setup(self):
        from transformers import pipeline

        batch_size = estimate_batch_size()
        print(f"Using batch size {batch_size}")

        self.clf = pipeline(
            "zero-shot-classification",
            model=MODEL_ID,
            device="cuda",
            batch_size=batch_size,
        )

    @modal.method()
    def predict(
        self,
        terms: list[str],
        categories: list[dict],
        post_processing_rules: list[dict],
    ) -> list[dict]:
        categories_short = [cat['name'] for cat in categories]
        categories_verbose = [cat['name'] + ': ' + cat['description'] for cat in categories]

        # 1. Contextualize + infer
        contextualized = [f"Toronto City Council agenda topic: {t}" for t in terms]
        results = self.clf(
            contextualized,
            categories_verbose,
            multi_label=True,
            hypothesis_template=HYPOTHESIS_TEMPLATE,
        )

        # 2. Build score rows
        rows = []
        for result, original_term in zip(results, terms):
            score_map = dict(zip(result['labels'], result['scores']))
            row = {short: score_map[verbose]
                   for short, verbose in zip(categories_short, categories_verbose)}
            row['subject_term'] = original_term
            row['max_val'] = max(row[c] for c in categories_short)
            row['max_cat'] = max(categories_short, key=lambda c: row[c])
            rows.append(row)

        # 3. Post-processing rules (first match wins, skip already-overridden)
        for rule in post_processing_rules:
            target_cat = rule["category"]
            for row in rows:
                if row['max_val'] < 1.0 and row['max_cat'] != target_cat:
                    if re.search(rule["pattern"], row['subject_term'], re.IGNORECASE):
                        row['max_cat'] = target_cat
                        row['max_val'] = 1.0
        return rows

# ── Local entrypoint ──────────────────────────────────────────────────────────

@app.local_entrypoint()
def main(terms_file: str = "terms.txt", categories_file: str = "categories.json", post_rules_file: str = "post-rules.json", output: str = "results.csv"):
    # Check input files exist
    if not os.path.exists(terms_file):
        raise FileNotFoundError(f"Terms file not found: {terms_file}")
    if not os.path.exists(categories_file):
        raise FileNotFoundError(f"Categories file not found: {categories_file}")
    if not os.path.exists(post_rules_file):
        raise FileNotFoundError(f"Post-processing rules file not found: {post_rules_file}")

    # Load terms
    with open(terms_file, "r", encoding="utf-8") as f:
        terms = [line.strip() for line in f if line.strip()]
    print(f"Loaded {len(terms)} terms")

    # Load categories
    with open(categories_file, "r", encoding="utf-8") as f:
        categories = json.load(f)
    print(f"Loaded {len(categories)} categories")

    # Load post-processing rules
    with open(post_rules_file, "r", encoding="utf-8") as f:
        post_processing_rules = json.load(f)
    print(f"Loaded {len(post_processing_rules)} post-processing rules")

    # For small set of terms (<=200) run them sequentially in one container.
    # For larger sets of terms (>200) run them in subsets of `chunk_size` in parallel containers
    if len(terms) <= 200:
        results = Classifier().predict.remote(
            terms, categories=categories, post_processing_rules=post_processing_rules
        )
    else:
        chunk_size = 500
        chunks = [terms[i:i+chunk_size] for i in range(0, len(terms), chunk_size)]
        results = []
        for chunk_results in Classifier().predict.map(
            chunks,
            kwargs={"categories": categories, "post_processing_rules": post_processing_rules},
        ):
            results.extend(chunk_results)

    # Write CSV
    categories_short = [cat["name"] for cat in categories]
    fieldnames = ['subject_term'] + categories_short + ['max_val', 'max_cat']
    with open(output, 'w', newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    print(f"Wrote {len(results)} rows to {output}")