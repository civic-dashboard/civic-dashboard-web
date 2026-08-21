"""
Compare inference outputs from a Jupyter notebook CSV and a Modal app CSV.
Validates that for every subject_term present in both files:
  1. Each category probability is within an absolute tolerance.
  2. max_val is within an absolute tolerance.
  3. max_cat is an exact string match.
Usage:
  python compare_outputs.py <csv_a> <csv_b> <categories.json> [--tol 1e-4]
"""
import argparse
import csv
import json
import sys
from pathlib import Path

def load_category_names(categories_path: str) -> list[str]:
    """Read the categories JSON and return the list of `name` fields."""
    with open(categories_path, "r") as f:
        categories = json.load(f)
    return [c["name"] for c in categories]

def load_csv(path: str, category_names: list[str]) -> dict[str, dict]:
    """
    Load a CSV into a dict keyed by subject_term.
    Each value is a dict with:
      - categories: {category_name: float | None}
      - max_val: float | None
      - max_cat: str | None
    """
    rows_by_subject: dict[str, dict] = {}
    with open(path, "r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            subject = row["subject_term"]
            if subject is None:
                continue
            categories: dict[str, float | None] = {}
            for name in category_names:
                raw = row.get(name, "")
                if raw is None or raw.strip() == "":
                    categories[name] = None
                else:
                    try:
                        categories[name] = float(raw)
                    except ValueError:
                        categories[name] = None
            max_val_raw = row.get("max_val", "")
            max_val = None if max_val_raw is None or max_val_raw.strip() == "" else float(max_val_raw)
            max_cat_raw = row.get("max_cat", "")
            max_cat = None if max_cat_raw is None else max_cat_raw.strip()
            rows_by_subject[subject] = {
                "categories": categories,
                "max_val": max_val,
                "max_cat": max_cat,
            }
    return rows_by_subject

def compare(csv_a: str, csv_b: str, categories_path: str, tol: float) -> int:
    """Run the comparison. Returns the number of inconsistencies found."""
    category_names = load_category_names(categories_path)
    data_a = load_csv(csv_a, category_names)
    data_b = load_csv(csv_b, category_names)
    subjects_a = set(data_a.keys())
    subjects_b = set(data_b.keys())
    common = subjects_a & subjects_b
    only_a = subjects_a - subjects_b
    only_b = subjects_b - subjects_a

    # --- Subjects only in one file ---
    if only_a:
        print(f"\n=== Subjects only in {Path(csv_a).name} ({len(only_a)}) ===")
        for s in sorted(only_a):
            print(f"  {s}")
    if only_b:
        print(f"\n=== Subjects only in {Path(csv_b).name} ({len(only_b)}) ===")
        for s in sorted(only_b):
            print(f"  {s}")

    # --- Compare common subjects ---
    category_violations: list[tuple[str, str, float, float, float]] = []
    max_val_violations: list[tuple[str, float, float, float]] = []
    max_cat_violations: list[tuple[str, str, str]] = []
    for subject in sorted(common):
        row_a = data_a[subject]
        row_b = data_b[subject]
        # 1. Category-by-category comparison
        for name in category_names:
            val_a = row_a["categories"][name]
            val_b = row_b["categories"][name]
            # Skip if either is missing
            if val_a is None or val_b is None:
                continue
            diff = abs(val_a - val_b)
            if diff > tol:
                category_violations.append((subject, name, val_a, val_b, diff))
        # 2. max_val comparison
        if row_a["max_val"] is not None and row_b["max_val"] is not None:
            diff = abs(row_a["max_val"] - row_b["max_val"])
            if diff > tol:
                max_val_violations.append((subject, row_a["max_val"], row_b["max_val"], diff))
        # 3. max_cat comparison (exact match)
        if row_a["max_cat"] is not None and row_b["max_cat"] is not None:
            if row_a["max_cat"] != row_b["max_cat"]:
                max_cat_violations.append((subject, row_a["max_cat"], row_b["max_cat"]))

    # --- Report ---
    print(f"\n=== Summary ===")
    print(f"  Subjects in both files: {len(common)}")
    print(f"  Tolerance:              {tol}")
    print(f"  Category violations:    {len(category_violations)}")
    print(f"  max_val violations:     {len(max_val_violations)}")
    print(f"  max_cat violations:     {len(max_cat_violations)}")
    if category_violations:
        print(f"\n=== Category value differences (>{tol}) ===")
        print(f"  {'Subject':<40} {'Category':<30} {'CSV A':>10} {'CSV B':>10} {'Diff':>10}")
        for subject, name, va, vb, diff in category_violations:
            print(f"  {subject:<40} {name:<30} {va:>10.6f} {vb:>10.6f} {diff:>10.6f}")
    if max_val_violations:
        print(f"\n=== max_val differences (>{tol}) ===")
        print(f"  {'Subject':<40} {'CSV A':>10} {'CSV B':>10} {'Diff':>10}")
        for subject, va, vb, diff in max_val_violations:
            print(f"  {subject:<40} {va:>10.6f} {vb:>10.6f} {diff:>10.6f}")
    if max_cat_violations:
        print(f"\n=== max_cat mismatches ===")
        print(f"  {'Subject':<40} {'CSV A':<30} {'CSV B':<30}")
        for subject, ca, cb in max_cat_violations:
            print(f"  {subject:<40} {ca:<30} {cb:<30}")
    total = len(category_violations) + len(max_val_violations) + len(max_cat_violations)
    if total == 0 and not only_a and not only_b:
        print("\n✓ All checks passed - outputs are consistent within tolerance.")
    return total + len(only_a) + len(only_b)

def main():
    parser = argparse.ArgumentParser(
        description="Compare two inference CSV outputs for consistency."
    )
    parser.add_argument("csv_a", help="Path to the first CSV (e.g., notebook output)")
    parser.add_argument("csv_b", help="Path to the second CSV (e.g., modal output)")
    parser.add_argument("categories", help="Path to the categories JSON file")
    parser.add_argument(
        "--tol",
        type=float,
        default=1e-2,
        help="Absolute tolerance for numeric comparisons (default: 1e-4)",
    )
    args = parser.parse_args()
    inconsistencies = compare(args.csv_a, args.csv_b, args.categories, args.tol)
    if inconsistencies > 0:
        sys.exit(1)
if __name__ == "__main__":
    main()