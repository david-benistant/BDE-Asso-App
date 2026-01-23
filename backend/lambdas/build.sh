#!/bin/bash

for dir in ./*/src/routes/*/; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing in $dir"
    (cd "$dir" && npm run build)
  fi
done
