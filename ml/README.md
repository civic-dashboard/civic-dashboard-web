# Machine Learning

This directory contains the ML tools used for Civic Dashboard. 

## Contents

- `dev/` - development artifacts (Jupyter notebook)
- `prod/` - productions artifacts (Modal app)
- `samples/` - datasets for testing
- `scripts/` - utility scripts

## Subject Term Categorization

The primary ML application currently is assigning categories to agenda item subject terms. 

### Comparing Outputs

`scripts/compare_outputs.py` can be used to compare the .csv outputs of either the Jupyter notebook or Modal app.

```shell
python scripts/compare_outputs.py resultsA.csv resultsB.csv categories.json
```

> [!NOTE]
> Since the notebook and Modal app run on different hardware some minor variance in the scores is expected, but should not affect the final category. The script defaults to a tolerance of 0.01, but can adjusted with `--tol`.
