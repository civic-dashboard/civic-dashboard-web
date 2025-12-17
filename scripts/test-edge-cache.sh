#!/usr/bin/env bash
# Quick checklist for testing the edge cache behavior on your deployment.
# Usage: ./scripts/test-edge-cache.sh https://civicdashboard.ca/councillors/some-contact-slug

URL="$1"
if [ -z "$URL" ]; then
  echo "Usage: $0 <url>"
  exit 1
fi

echo "-- First HEAD (cold) --"
curl -I -s "$URL" | egrep -i 'Cache-Control|CF-Cache-Status|Server|Set-Cookie' || true

echo "\n-- First full request (cold) and timing --"
time curl -sS -o /dev/null "$URL"

echo "\n-- Second full request (should be faster / served from cache) and headers --"
time curl -i -s "$URL" | egrep -i 'Cache-Control|CF-Cache-Status|Server|Set-Cookie' || true

echo "\n-- Request with cookie (should NOT vary cache key if worker strips cookies) --"
curl -i -s -H "Cookie: session=bogus" "$URL" | egrep -i 'Cache-Control|CF-Cache-Status|Set-Cookie' || true

echo "\n-- Force origin refresh by requesting a query param, to see different caching if your origin varies --"
curl -i -s "$URL?refresh=1" | egrep -i 'Cache-Control|CF-Cache-Status|Server' || true

cat <<'EOF'
Interpreting results:
- Look for `Cache-Control: public, s-maxage=...` on responses (worker sets this on cached items).
- `CF-Cache-Status: HIT` indicates Cloudflare served from its edge cache. `MISS` on first request is expected.
- Timing: second request should be noticeably faster if cached at the edge.
- If requests with `Cookie` differ, you may be varying cache by cookie; worker strips cookies for cache keys by default.
EOF
