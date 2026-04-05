#!/bin/bash

# Define files in the seeds directory
FILE1="seeds/Subject Term Similarity - All terms.csv"
FILE2="seeds/similarities.csv"
FILE3="seeds/all_terms.csv"

echo "Counting unique subject_terms in CSV files..."
echo "------------------------------------------"

# Function to count unique terms in a CSV file
count_unique() {
    local file="$1"
    local col="$2"
    local name="$3"

    if [ ! -f "$file" ]; then
        echo "Error: $file not found."
        return
    fi

    # Extract terms, skip header, remove brackets and normalize to lowercase, then count unique
    local count=$(tail -n +2 "$file" | awk -F',' -v col="$col" '{print $col}' | tr -d '[]' | tr '[:upper:]' '[:lower:]' | sed 's/^ *//;s/ *$//' | sort -u | wc -l | xargs)
    
    printf "%-45s : %s\n" "$name" "$count"
}

# 1. Subject Term Similarity - All terms.csv (second column)
count_unique "$FILE1" 2 "Subject Term Similarity - All terms"

# 2. similarities.csv (first column)
count_unique "$FILE2" 1 "similarities"

# 3. all_terms.csv (second column)
count_unique "$FILE3" 2 "all_terms"

# 4. Count unique tagRaw in categories_tags.json
JSON_FILE="seeds/categories_tags.json"
JSON_COUNT=$(jq -r '.[].tagRaw' "$JSON_FILE" | tr '[:upper:]' '[:lower:]' | sed 's/^ *//;s/ *$//' | sort -u | wc -l | xargs)
printf "%-45s : %s\n" "categories_tags.json (tagRaw)" "$JSON_COUNT"

echo "------------------------------------------"
