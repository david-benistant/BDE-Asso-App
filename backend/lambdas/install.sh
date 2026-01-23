#!/bin/bash

for dir in ./*/; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing in $dir"
    (cd "$dir" && npm install)
  fi
done
