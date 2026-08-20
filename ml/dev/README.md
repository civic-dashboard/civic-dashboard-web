# Jupyter Notebook Development

This directory contains all development artifacts:
- `subject-terms-categorization.ipynb` - Jupyter notebook for development and testing
- `input/subject_terms.txt` - a dump of all known subject terms
- `input/categories.json` - name and description for every category
- `input/GT-TAH-June8.csv` - ground truth, manually created dataset for validation

### Updating Subject Terms

A static dump of subject terms is stored in `input/subject_terms.txt`.

To dump all subject terms from the database:
```sh
npm run tsxe src/scripts/tag-exportSubjectTerms.ts
```
*Note: Ensure your `.env` is pointed to the production database if you want the most up-to-date terms.*

### Post Processing Rules

Rules are defined in `input/post-processing-rules.json`, and loaded into the notebook.

```json
{"pattern": "...", "category": "..."}
```

For each rule, the regex `pattern` is used to select subject terms, and then the `category` is applied to each of them.