#!/bin/bash

if command -v bun >/dev/null 2>&1; then
  JS_RUNTIME="bun"
elif command -v node >/dev/null 2>&1; then
  JS_RUNTIME="node"
else
  echo "Aucun runtime JS trouvé (node ou bun requis)"
  exit 1
fi

echo "Using JS runtime: $JS_RUNTIME"

for dir in ./*/; do
  if [ -f "$dir/build.js" ]; then
    echo "Running build.js in $dir"
    (cd "$dir" && $JS_RUNTIME build.js)
  fi
done