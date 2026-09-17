# Subject Term Classification

A **subject term** is a type of keyword that is included in the metadata of agenda items. The total set of subject terms is growing, and their usefulness for querying agenda items is limited. To mitigate this, we have utilized zeroshot classification to associate a category with each subject term.


## Data Flow

This section aims to describe the flow of data through the various components. All of this occurs automatically inside scheduled Github Actions workflows.

1. Raw data is fetched from TMMIS
    - The raw agenda items are inserted into the DB table `RawAgendaItemConsiderations`
    - Table `AgendaItemSubjectTerms` is populated with exploded and normalized forms 
        - First the raw field is exploded to separate the individual terms
        - Normalized and slugified forms are constructed and stored for each term
    - Table `AgendaItemCategories` is populated with (`agendaItemId`, `category`) pairs for new agenda items based on existing subject terms 

2. We run `exportAllSubjectTerms.ts` to fetch all subject terms from the database
    - Script fetches all subject terms from `RawAgendaItemConsiderations`, defaults to fetching only subject terms that have not yet been categorized
    - Deduplicates based on the *raw* and *slug* form
    - Outputs to .txt file

3. Perform zeroshot classification to establish a category for each subject term
    - Subject terms are provided as a .txt file
    - Processing is done remotely on the Modal platform, results are captured locally. It is also possible to run the Jupyter notebook, which should produce the same result (expect minor score variance due to hardware differences)
    - Output is a CSV file with columns including `subject_term` and `max_cat` (the "best" category)

4. Run `generateCategoryMappings.ts` to extract data from CSV and merge with other subject term forms
    - Consumes the classification output CSV
    - Outputs array of JSON objects, representing each term:
      - `{"category": string, "tagRaw": string, "tagNormalized": string, "tagSlug": string}`

5. Run `ingestClassificationResults.ts` to insert results into the database
    - Upserts newly classified terms in `TagCategories` 
    - Truncates `AgendaItemCategories` and completely rebuilds the table for all agenda items