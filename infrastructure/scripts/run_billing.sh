#!/usr/bin/env bash
# PlanLedger Manual Billing Execution Script (Bash)
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$SCRIPT_DIR/../../apps/api"

echo "=========================================================="
echo " PlanLedger Billing Engine Manual Invocation"
echo "=========================================================="

cd "$API_DIR"

EXTRA_ARGS=""
for arg in "$@"; do
  EXTRA_ARGS="$EXTRA_ARGS $arg"
done

python manage.py run_billing $EXTRA_ARGS

echo "=========================================================="
echo " Billing execution completed."
