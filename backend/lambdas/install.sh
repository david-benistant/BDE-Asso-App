#!/bin/bash

for dir in ./*/; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing in $dir"
    (cd "$dir" && bun install)
  fi
done
