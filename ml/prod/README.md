# Production App

This directory contains a Modal app to run the zeroshot classification used to categorize agenda item subject terms.

## Setup

1. Create a modal account: https://modal.com/signup
2. (Optional) Add a credit card to your account to get $30/month free credits.
3. Create a virtual environment:
    - uv - `uv venv`
    - venv - `python3 -m venv .venv`
4. Activate the virtual environment: `source .venv/bin/activate`
5. Install deps:
    - uv `uv pip install -r requirements.txt`
    - venv - `pip install -r requirements.txt`

## Running App

The Modal app requires 3 inputs:
- Subject terms - subject terms we want to classify, `.txt` file
- Categories - a JSON object of all possible categories and their descriptions (`inputs/categories.json`)
- Post-processing rules - a JSON object of all the post-processing rules (`inputs/post-processing-rules.json`)
```shell
modal run app.py \
  --terms-file ../samples/subject_terms_sample_500.txt\
  --categories-file inputs/categories.json \
  --post-rules-file inputs/post-processing-rules.json
```

The output will be written to `results.csv`.