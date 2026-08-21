"""
Randomly sample a subset of subject terms from a text file (one per line).
Usage:
  python sample_subjects.py <input.txt> <output.txt> <count>
"""
import argparse
import random
import sys
def main():
    parser = argparse.ArgumentParser(
        description="Randomly sample a subset of subject terms from a text file."
    )
    parser.add_argument("input", help="Path to the input text file (one subject per line)")
    parser.add_argument("output", help="Path to write the sampled subjects to")
    parser.add_argument("count", type=int, help="Number of subjects to sample")
    args = parser.parse_args()
    with open(args.input, "r") as f:
        subjects = [line.strip() for line in f if line.strip()]
    total = len(subjects)
    if total == 0:
        print("Error: input file is empty or contains no non-blank lines.", file=sys.stderr)
        sys.exit(1)
    if args.count > total:
        print(
            f"Warning: requested {args.count} but only {total} subjects available. "
            f"Using all {total}.",
            file=sys.stderr,
        )
        args.count = total
    sampled = sorted(random.sample(subjects, args.count))
    with open(args.output, "w") as f:
        for s in sampled:
            f.write(s + "\n")
    print(f"Sampled {args.count} of {total} subjects → {args.output}")
if __name__ == "__main__":
    main()