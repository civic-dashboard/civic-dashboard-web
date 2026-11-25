#!/usr/bin/env bash
set -euo pipefail

npm run db:run-migrations
npm run dev:html

touch /tmp/civic-dashboard-devcontainer-ready
