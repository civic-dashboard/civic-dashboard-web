#!/usr/bin/env bash
set -euo pipefail

cat > .env <<'EOF'
DATABASE_URL=postgresql://postgres:postgres@database:5432/civic_dashboard
HOSTNAME_FOR_EMAIL_LINKS=http://localhost:3000
RESEND_API_KEY=not-needed-for-local-dev
EOF

npm run db:run-migrations
npm run dev:html

touch /tmp/civic-dashboard-devcontainer-ready
