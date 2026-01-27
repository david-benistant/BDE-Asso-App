#!/bin/bash

for dir in ./*/; do
  if [ -f "$dir/build.js" ]; then
    echo "Installing in $dir"
    (cd "$dir" && node build.js)
  fi
done
