#!/bin/bash

# Path to the JSON file
JSON_FILE="seeds/categories_tags.json"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install it to run this script."
    exit 1
fi

# Check if the file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "Error: File $JSON_FILE not found."
    exit 1
fi

# Extract unique categories using jq
echo "Unique categories in $JSON_FILE:"
jq -r '.[].category' "$JSON_FILE" | sort -u
