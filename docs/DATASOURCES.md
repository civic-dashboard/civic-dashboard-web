# Data Sources

This document outlines the two primary data sources used by Civic Dashboard: **TMMIS** and **Open Data**.

## TMMIS (Toronto Meeting Management Information System)

TMMIS is an unofficial API used by the City of Toronto on [their website](https://secure.toronto.ca/council/#/highlights) to show council agenda items and committees. This API brings the data for the [Actions page](https://civicdashboard.ca/actions).

**Important Note:** Because this is not a public Open Data API, it is not officially supported or guaranteed to remain available by the City of Toronto. We use this unofficial API because the specific agenda item data we need is not available on the official Open Data portal.

* **Base URL:** `https://secure.toronto.ca/council/api/`
* **Core Logic:** Located in [`src/api/cityCouncilRequest.ts`](../src/api/cityCouncilRequest.ts).
* **Authentication:** Requires fetching a CSRF token before querying and using specific headers to mimic a browser request.

### Agenda Items

We fetch Agenda items that are scheduled to appear in future committee and council meetings.

* **Data Schema & Fetch Logic:** [`src/api/agendaItem.ts`](../src/api/agendaItem.ts)
* **Automation:** Fetched every hour via GitHub Actions ([`.github/workflows/update_database.yml`](../.github/workflows/update_database.yml)). See the [`README.md`](../README.md) for instructions on how to fetch in your local environment.
* **Manual Query Tool:** The [`src/scripts/query_TMMIS.sh`](../src/scripts/query_TMMIS.sh) script is useful if you want to manually call the TMMIS API to inspect raw agenda item data.
* **Database Table:** `RawAgendaItemConsiderations`

### Decision Bodies (Committees)

TMMIS also provides the list of decision bodies, which we use to filter agenda items on the Actions page.

* **Data Schema:** [`src/api/decisionBody.ts`](../src/api/decisionBody.ts)
* **Storage:** Saved statically in [`src/constants/decisionBodies.ts`](../src/constants/decisionBodies.ts) (not currently stored in the database).
* **Updates:** Updates are manual. Run the [`src/scripts/fetchDecisionBodies.ts`](../src/scripts/fetchDecisionBodies.ts) script to fetch a new JSON list for each council term and manually update the constant file.

---

## Open Data

The official [City of Toronto Open Data](https://open.toronto.ca) portal populates the [Councillors page](https://civicdashboard.ca/councillors). We retrieve the list of Councillors and the voting results on agenda items from this source.

**Note:** There is often a multi-week delay between when a vote occurs and when the results are published to Open Data.

* **Core Logic:** [`src/backend/open-data/OpenDataClient.ts`](../src/backend/open-data/OpenDataClient.ts)
* **Catalog:** Package IDs for queried datasets are stored in [`src/backend/open-data/openDataCatalog.json`](../src/backend/open-data/openDataCatalog.json).
* **Automation:** Queried weekly via GitHub Actions ([`.github/workflows/update_contacts_votes.yml`](../.github/workflows/update_contacts_votes.yml)). See the [`README.md`](../README.md) for instructions on how to fetch in your local environment.

### Councillors

Contains the list of councillors and their contact information.

* **Source Dataset & Data Schema:** [Elected Officials Contact Information](https://open.toronto.ca/dataset/elected-officials-contact-information/)
* **Database Table:** `RawContacts`

### Votes

Contains the voting records for members of the Toronto City Council.

* **Source Dataset & Data Schema:** [Members of Toronto City Council Voting Record](https://open.toronto.ca/dataset/members-of-toronto-city-council-voting-record/)
* **Database Table:** `RawVotes`

## How to Access and Visualize the Database

To explore the data structure and run manual queries, you can connect directly to your local dev PostgreSQL database running in Docker. Ensure to follow instructions from the [`README.md`](../README.md) file to set it up and to load a small amount of data.

### Local Connection Details

When the database and Docker are running, use these credentials in your database client:

*   **Host:** `localhost`
*   **Port:** `54320`
*   **User:** `postgres`
*   **Password:** `postgres`
*   **Database:** `civic_dashboard`

### Recommended GUI Tools

While you can use the command-line `psql` tool, most developers prefer a graphical interface to navigate tables and visualize relationships:

1.  **[DBeaver](https://dbeaver.io/):** Free and open-source universal database tool.
2.  **[pgAdmin](https://www.pgadmin.org/):** The most popular "official" administration and management tool for PostgreSQL.
3.  **VS Code Extensions:** If you prefer to stay in your editor, there is an official extension: **[PostgreSQL](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql)**