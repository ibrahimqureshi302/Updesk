#!/bin/bash

cd ~/Downloads/updesk/updesk_frontend

echo "Fixing React imports..."

# Add React import to main.jsx
if [ -f src/main.jsx ]; then
    sed -i '1iimport React from "react"\n' src/main.jsx
    echo "Fixed src/main.jsx"
fi

# Add React import to App.jsx
if [ -f src/App.jsx ]; then
    sed -i '1iimport React from "react"\n' src/App.jsx
    echo "Fixed src/App.jsx"
fi

# Add React import to all page files
for file in src/pages/*.jsx; do
    if [ -f "$file" ]; then
        if ! grep -q "^import React" "$file"; then
            sed -i '1iimport React from "react"\n' "$file"
            echo "Fixed: $file"
        fi
    fi
done

# Add React import to all component files
for file in src/components/*/*.jsx; do
    if [ -f "$file" ]; then
        if ! grep -q "^import React" "$file"; then
            sed -i '1iimport React from "react"\n' "$file"
            echo "Fixed: $file"
        fi
    fi
done

# Add React import to hooks
for file in src/hooks/*.js; do
    if [ -f "$file" ]; then
        if ! grep -q "^import React" "$file"; then
            sed -i '1iimport React from "react"\n' "$file"
            echo "Fixed: $file"
        fi
    fi
done

# Clear cache
rm -rf node_modules/.vite

echo "All fixes applied! Run 'npm run dev'"
