#!/bin/bash
# Compare two Boundaries Map API deployments by response
#
#   infra/endpoint-diff.sh https://bm-api.beta.nyc https://localhost
#
# Used for the local restore, the first deploy, cutover, and rebuild drill
# Exits non-zero if any case differs in status code or body
set -o pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <base-url-a> <base-url-b>" >&2
  exit 2
fi
A=${1%/}
B=${2%/}

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
total=0
failed=0

# Prints "<status>" and writes the normalized body to $2
fetch() {
  local base=$1 out=$2 path=$3; shift 3
  local insecure=()
  # Caddy's local certificate isn't trusted by this machine
  [[ $base == https://localhost* ]] && insecure=(--insecure)
  local args=()
  for kv in "$@"; do args+=(--data-urlencode "$kv"); done
  local status
  status=$(curl -sS "${insecure[@]}" --max-time 120 --get -o "$out.raw" -w '%{http_code}' \
    "${args[@]}" "$base$path") || status="curl-failed"
  # The SQL has no ORDER BY, so sort features before comparing; non-JSON bodies are compared as-is
  jq -S 'if type == "object" and has("features")
         then .features |= sort_by(.properties.id, .properties.namecol, .properties.namealt)
         else . end' "$out.raw" > "$out" 2>/dev/null || cp "$out.raw" "$out"
  echo "$status"
}

check() {
  local path=$1; shift
  local label="$path $*"
  total=$((total + 1))
  local sa sb
  sa=$(fetch "$A" "$work/a" "$path" "$@")
  sb=$(fetch "$B" "$work/b" "$path" "$@")
  # A request that never got a response is a failure, even if both sides failed the same way
  if [ "$sa" = curl-failed ] || [ "$sb" = curl-failed ]; then
    failed=$((failed + 1)); echo "FAIL  $label  status $sa vs $sb"
  elif [ "$sa" != "$sb" ]; then
    failed=$((failed + 1)); echo "DIFF  $label  status $sa vs $sb"
  elif ! cmp -s "$work/a" "$work/b"; then
    failed=$((failed + 1)); echo "DIFF  $label  (status $sa, bodies differ)"
    diff "$work/a" "$work/b" | head -5 | sed 's/^/      /'
  else
    echo "same  $label  ($sa)"
  fi
}

# Every boundary type
for id in bid cc cd cdta dsny ed fb hc hd ibz mc nda nta nycongress pp ps puma sa sd ss uhf zipcode; do
  check /bounds_new "id=$id"
done

# One district per boundary type (the alphabetically first one, so runs are repeatable)
while IFS='|' read -r boundid featureid; do
  check /district_int_new "boundid=$boundid" "featureid=$featureid"
done <<'CASES'
bid|125th Street
cc|1
cd|101
cdta|BK01
dsny|BKN01
ed|23001
fb|1
hc|11
hd|Addisleigh Park Historic District
ibz|Astoria
mc|101
nda|103
nta|Allerton
nycongress|10
pp|1
ps|100A
puma|4103
sa|23
sd|1
ss|10
uhf|Bayside - Little Neck
zipcode|07305
CASES

# Points across the five boroughs, plus one in the harbor
while read -r lng lat _; do
  check /pt_int_new "p_lng=$lng" "p_lat=$lat"
done <<'POINTS'
-73.9857 40.7484  Empire State Building
-73.9654 40.7829  Central Park
-73.9396 40.8448  Washington Heights
-73.9752 40.6826  Barclays Center
-73.9262 40.8296  Yankee Stadium
-73.8303 40.7596  Flushing
-73.7781 40.6413  JFK Airport
-74.1660 40.5822  Staten Island Mall
-74.0445 40.6700  Upper New York Bay
POINTS

# Error responses are part of what the frontend sees
check /bounds_new
check /bounds_new "id=not-a-boundary"
check /pt_int_new "p_lng=-73.9857"
check /pt_int_new "p_lng=abc" "p_lat=40.7484"
check /district_int_new "boundid=cd"
check /district_int_new "boundid=cd" "featureid=does-not-exist"

echo
echo "$total cases, $failed differ"
[ "$failed" -eq 0 ]
