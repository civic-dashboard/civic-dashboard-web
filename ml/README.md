# Machine Learning - Subject Term Categorization

This directory contains the tools and instructions for grouping and categorizing subject terms using machine learning models.

## Workflow

1.  **Export Subject Terms:** Retrieve all normalized subject terms from the database by running:
    ```sh
    npm run tsxe src/scripts/exportNormalizedSubjectTerms.ts
    ```
    *Note: Ensure your `.env` is pointed to the production database if you want the most up-to-date terms.*

2.  **Verify Output:** A new file will be generated at [input/normalized_subject_terms.txt](input/normalized_subject_terms.txt). This file is also committed to the repository if you wish to skip the export step.

3.  **Setup Kaggle:**
    - Create a [Kaggle](https://www.kaggle.com/) account.
    - Go to your profile and verify your phone number (required for GPU access).

4.  **Import Notebook:** Create a new notebook in Kaggle and import the local file: [2026-05-11-subject-term-grouping-to-tags.ipynb](2026-05-11-subject-term-grouping-to-tags.ipynb).

5.  **Data Source:** By default, the notebook queries the `normalized_subject_terms.txt` file directly from the GitHub `main` branch. You can manually upload your own version to the Kaggle session if needed.

6.  **Configuration:** In the notebook, ensure the `categories` list contains the specific tags you want to test for similarity and associate with the subject terms.

7.  **Execution Environment:**
    - Go to **Session Options**.
    - Enable **Internet Access**.
    - Set the **Accelerator** to **GPU T4 x2**.
