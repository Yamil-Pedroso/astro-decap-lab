#!/bin/bash

set -a
source "$(dirname "$0")/../.env"
set +a

curl -fsS -X POST \
  http://localhost:4321/api/reconcile-mail \
  -H "Origin: http://localhost:4321" \
  -H "Authorization: Bearer ${MAIL_RECONCILE_SECRET}"
