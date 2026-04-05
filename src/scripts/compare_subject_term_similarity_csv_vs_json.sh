#!/bin/bash

# Define files
CSV_FILE="seeds/Subject Term Similarity - All terms.csv"
JSON_FILE="seeds/categories_tags.json"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install it."
    exit 1
fi

# Extract subject_term from Subject Term Similarity - All terms.csv (skipping header, second column)
# Normalize: remove brackets [], convert to lowercase, trim whitespace
CSV_TERMS=$(tail -n +2 "$CSV_FILE" | awk -F',' '{print $2}' | tr -d '[]' | tr '[:upper:]' '[:lower:]' | sed 's/^ *//;s/ *$//' | sort -u)

# Extract tagRaw from categories_tags.json
# Normalize: convert to lowercase, trim whitespace
JSON_TERMS=$(jq -r '.[].tagRaw' "$JSON_FILE" | tr '[:upper:]' '[:lower:]' | sed 's/^ *//;s/ *$//' | sort -u)

# Output results
echo "Comparison between \"$CSV_FILE\" [subject_term] and $JSON_FILE [tagRaw]:"
echo "------------------------------------------------------------"

# Create temporary files for comparison
CSV_TEMP=$(mktemp)
JSON_TEMP=$(mktemp)

echo "$CSV_TERMS" > "$CSV_TEMP"
echo "$JSON_TERMS" > "$JSON_TEMP"

# Count unique terms
COUNT_CSV=$(wc -l < "$CSV_TEMP" | xargs)
COUNT_JSON=$(wc -l < "$JSON_TEMP" | xargs)

echo "Unique Terms in CSV (normalized): $COUNT_CSV"
echo "Unique Terms in JSON (normalized): $COUNT_JSON"

# Find items only in CSV
DIFF_CSV=$(comm -23 "$CSV_TEMP" "$JSON_TEMP")
COUNT_DIFF_CSV=$(echo "$DIFF_CSV" | sed '/^\s*$/d' | wc -l | xargs)

# Find items only in JSON
DIFF_JSON=$(comm -13 "$CSV_TEMP" "$JSON_TEMP")
COUNT_DIFF_JSON=$(echo "$DIFF_JSON" | sed '/^\s*$/d' | wc -l | xargs)

echo "------------------------------------------------------------"
echo "Terms in CSV but NOT in JSON ($COUNT_DIFF_CSV):"
if [ "$COUNT_DIFF_CSV" -gt 0 ]; then
    echo "$DIFF_CSV" | head -n 20
    if [ "$COUNT_DIFF_CSV" -gt 20 ]; then echo "... and $((COUNT_DIFF_CSV - 20)) more"; fi
else
    echo "None"
fi

echo "------------------------------------------------------------"
echo "Terms in JSON but NOT in CSV ($COUNT_DIFF_JSON):"
if [ "$COUNT_DIFF_JSON" -gt 0 ]; then
    echo "$DIFF_JSON" | head -n 20
    if [ "$COUNT_DIFF_JSON" -gt 20 ]; then echo "... and $((COUNT_DIFF_JSON - 20)) more"; fi
else
    echo "None"
fi

# Cleanup
rm "$CSV_TEMP" "$JSON_TEMP"
