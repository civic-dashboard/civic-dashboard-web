import modal
import csv
import json
import os
import re

app = modal.App("civic-dashboard-categorize-subject-terms")

MODEL_ID = "MoritzLaurer/deberta-v3-large-zeroshot-v2.0"
HYPOTHESIS_TEMPLATE = "In Toronto municipal government, this topic relates to {}."
LOW_SCORE_THRESHOLD = 0.005
UNCATEGORIZED_SENTINEL = "Uncategorized"

# ── Image ─────────────────────────────────────────────────────────────────────

def download_model():
    from transformers import pipeline
    pipeline("zero-shot-classification", model=MODEL_ID)

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install( # These should match what the notebook is using
        "transformers==5.15.1",
        "torch==2.13.0"
    )
    .run_function(download_model)
    .env({"HF_HUB_OFFLINE": "1"})
)

# ── Classifier ────────────────────────────────────────────────────────────────

def estimate_batch_size() -> int:
    import torch
    free_bytes, _ = torch.cuda.mem_get_info()
    free_gb = free_bytes / (1024 ** 3)
    return min(max(int(free_gb * 1024 / 50), 8), 128)


@app.cls(image=image, gpu="T4", scaledown_window=120, timeout=300)
class Classifier:

    @modal.enter()
    def setup(self):
        from transformers import pipeline

        batch_size = estimate_batch_size()
        print(f"Using model batch size {batch_size}")

        self.clf = pipeline(
            "zero-shot-classification",
            model=MODEL_ID,
            device="cuda",
            batch_size=batch_size,
            local_files_only=True,
        )

    @modal.method()
    def classify(
        self,
        terms: list[str],
        categories: list[dict],
    ) -> list[dict]:
        print(f"Running classification for {len(terms)} terms")
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

        return rows

# ── Local entrypoint ──────────────────────────────────────────────────────────

def run_post_processing(rules:list[dict], results: list[dict]):
    print("Running post-processing rules")
    for i, rule in enumerate(rules, 1):
        target_cat = rule["category"]
        pattern = rule["pattern"]
        count = 0
        for row in results:
            if (re.search(pattern, row['subject_term'], re.IGNORECASE)
                    and row['max_val'] < 1.0
                    and row['max_cat'] != target_cat):
                row['max_cat'] = target_cat
                row['max_val'] = 1.0
                count += 1

        print(f"Rule {i}:\n\tCategory: {target_cat}\n\tPattern: {pattern}\n\tTerms corrected: {count}")

    # Mark any terms below the threshold as uncategorizable
    uncategorized_count = 0
    for row in results:
        if row['max_val'] < LOW_SCORE_THRESHOLD:
            row['max_cat'] = UNCATEGORIZED_SENTINEL
            uncategorized_count += 1
    print(f"Marked {uncategorized_count} terms as {UNCATEGORIZED_SENTINEL} (max_val < {LOW_SCORE_THRESHOLD})")
    return results

@app.local_entrypoint()
def main(terms_file: str, categories_file: str = "inputs/categories.json", post_rules_file: str = "inputs/post-processing-rules.json", output: str = "results.csv"):
    if not terms_file.endswith('.txt'):
        raise ValueError(f"Terms file must be a .txt file, got: {terms_file}")
    if not os.path.exists(terms_file):
        raise FileNotFoundError(f"Terms file not found: {terms_file}")

    if not categories_file.endswith('.json'):
        raise ValueError(f"Categories file must be a .json file, got: {categories_file}")
    if not os.path.exists(categories_file):
        raise FileNotFoundError(f"Categories file not found: {categories_file}")

    if not post_rules_file.endswith('.json'):
        raise ValueError(f"Post-processing rules file must be a .json file, got: {post_rules_file}")
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

    # For small set of terms (<= chunk_size) run them sequentially in one container.
    # For larger sets of terms (> chunk_size) run them in subsets of `chunk_size` in parallel containers
    chunk_size = 200
    if len(terms) <= chunk_size:
        results = Classifier().classify.remote(terms, categories)
    else:
        chunks = [terms[i:i+chunk_size] for i in range(0, len(terms), chunk_size)]
        results = []
        for chunk_results in Classifier().classify.map(
            chunks,
            kwargs={"categories": categories},
        ):
            results.extend(chunk_results)

    # Run post-processing
    results = run_post_processing(post_processing_rules, results)

    # Write CSV
    categories_short = [cat["name"] for cat in categories]
    fieldnames = ['subject_term'] + categories_short + ['max_val', 'max_cat']
    with open(output, 'w', newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    print(f"Wrote {len(results)} rows to {output}")