#!/bin/bash

export PATH="/home/ubuntu/.bun/bin:$PATH"

if command -v bun >/dev/null 2>&1; then
  PKG_MANAGER="bun install"
elif command -v pnpm >/dev/null 2>&1; then
  PKG_MANAGER="pnpm install"
elif command -v yarn >/dev/null 2>&1; then
  PKG_MANAGER="yarn install"
else
  PKG_MANAGER="npm install"
fi


echo "Using package manager: $PKG_MANAGER"

for dir in ./*/; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing in $dir"
    (cd "$dir" && $PKG_MANAGER)
  fi
done