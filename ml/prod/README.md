# Production Deployment

This directory contains a productionized deployment of the zero-shot classification used to categorize agenda item _subject terms_.


# Setup

1. Create a modal account: https://modal.com/signup
2. (Optional) Add a credit card to your account to get $30/month free credits.
3. Create a virtual environment:
    - uv - `uv venv`
    - venv - `python3 -m venv .venv`
4. Activate the virtual environment: `source .venv/bin/activate`
5. Install modal package:
    - uv `uv pip install modal`
    - venv - `pip install modal`

# Inputs

The Modal app requires 3 inputs:
- Subject terms - these are the subject terms we want to classify
- Categories - a JSON object of all possible categories and their descriptions
- Post-processing rules - a JSON object of all the post-processing rules

An example for each of these can be found in `samples/`.

# Running

```shell
modal run app.py --terms-file samples/terms.txt --categories-file inputs/categories.json --post-rules-file inputs/post-processing-rules.json
```

The output will be written to `results.csv`.