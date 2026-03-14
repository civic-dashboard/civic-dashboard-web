#!/bin/bash

# Configuration: Edit these to query different time periods
START_DATE="2026-01-01T00:00:00.000Z"
END_DATE="2026-12-31T23:59:59.999Z"

BODY=$(cat <<EOF
{
  "includeTitle": true,
  "includeSummary": true,
  "includeRecommendations": true,
  "includeDecisions": true,
  "meetingFromDate": "$START_DATE",
  "meetingToDate": "$END_DATE"
}
EOF
)

# Define the CSRF endpoint
CSRF_URL="https://secure.toronto.ca/council/api/csrf.json"

# Define the API endpoint for agenda items
API_URL="https://secure.toronto.ca/council/api/multiple/agenda-items.json?pageNumber=0&pageSize=50&sortOrder=meetingDate%20asc,referenceSort"

# Define the common headers from the working command
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0"

echo "Fetching CSRF token from $CSRF_URL..."

# Fetch the CSRF token and save headers to a temporary file
HEADERS_FILE=$(mktemp)
BODY_FILE=$(mktemp)

# Execute the curl command that is known to work
HTTP_STATUS=$(curl -s -o "$BODY_FILE" -w "%{http_code}" --compressed "$CSRF_URL" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
  -H "Accept-Encoding: gzip, deflate, br, zstd" \
  -H "Accept-Language: en-US,en;q=0.5" \
  -H "Cache-Control: no-cache" \
  -H "Connection: keep-alive" \
  -H "Pragma: no-cache" \
  -H "Priority: u=0, i" \
  -H "Sec-Fetch-Dest: document" \
  -H "Sec-Fetch-Mode: navigate" \
  -H "Sec-Fetch-Site: none" \
  -H "Sec-Fetch-User: ?1" \
  -H "Upgrade-Insecure-Requests: 1" \
  -H "User-Agent: $USER_AGENT" \
  -D "$HEADERS_FILE")

echo "HTTP Status Code: $HTTP_STATUS"

if [ "$HTTP_STATUS" != "200" ]; then
  echo "Error: Received non-200 status code."
  echo "--- Response Headers ---"
  cat "$HEADERS_FILE"
  echo "--- Response Body ---"
  cat "$BODY_FILE"
  rm "$HEADERS_FILE" "$BODY_FILE"
  exit 1
fi

# Extract XSRF-TOKEN from the set-cookie header
XSRF_TOKEN=$(grep -i "^set-cookie:" "$HEADERS_FILE" | grep -o "XSRF-TOKEN=[^;]*" | head -n 1 | cut -d'=' -f2)

# Extract all cookies to be used in subsequent requests
# Note: we need to clean up the 'set-cookie:' prefix and the trailing whitespace/newlines
COOKIES=$(grep -i "^set-cookie:" "$HEADERS_FILE" | sed 's/^[Ss]et-[Cc]ookie: //i' | cut -d';' -f1 | paste -sd '; ' -)

if [ -z "$XSRF_TOKEN" ]; then
  echo "Error: Failed to retrieve XSRF-TOKEN from headers."
  echo "--- Response Headers ---"
  cat "$HEADERS_FILE"
  rm "$HEADERS_FILE" "$BODY_FILE"
  exit 1
fi

echo "Successfully retrieved XSRF-TOKEN: $XSRF_TOKEN"
echo "Cookies: $COOKIES"

# Cleanup headers and body from CSRF call
rm "$HEADERS_FILE" "$BODY_FILE"

echo ""
echo "Calling API: $API_URL..."

# Execute the API call
# We use the XSRF-TOKEN in the X-XSRF-TOKEN header and the full cookies in the Cookie header
RESPONSE=$(curl -s --compressed "$API_URL" \
  -X POST \
  -H "Accept: application/json, text/plain, */*" \
  -H "Accept-Language: en-US,en;q=0.5" \
  -H "Cache-Control: no-cache" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -H "Cookie: $COOKIES" \
  -H "Pragma: no-cache" \
  -H "Sec-Fetch-Dest: empty" \
  -H "Sec-Fetch-Mode: cors" \
  -H "Sec-Fetch-Site: same-origin" \
  -H "User-Agent: $USER_AGENT" \
  -H "X-XSRF-TOKEN: $XSRF_TOKEN" \
  -d "$BODY")

# Check if response is empty or contains an error
if [ -z "$RESPONSE" ]; then
  echo "Error: Received empty response from API."
  exit 1
fi

# Basic validation: check if the response looks like JSON and contains Records
if echo "$RESPONSE" | jq -e ".Records" > /dev/null 2>&1; then
  echo ""
  echo "Success! The API returned records."
  RECORD_COUNT=$(echo "$RESPONSE" | jq -r ".TotalRecordCount")
  echo "Total Record Count: $RECORD_COUNT"
  echo ""
  echo "First Record (Pretty Printed):"
  echo "$RESPONSE" | jq ".Records[0]"

  # To save the full raw response to a file, uncomment the line below:
  # echo "$RESPONSE" > output.txt && echo "Full response saved to output.txt"
else
  echo ""
  echo "Warning: Response does not appear to contain 'Records'. It might be an error message or empty results."
  echo "Full Response:"
  echo "$RESPONSE"
fi
