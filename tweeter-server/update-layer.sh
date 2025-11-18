#!/bin/bash

set -e

echo "Updating Lambda Layer dependencies..."

rm -rf layer/nodejs/node_modules 2>/dev/null || true
mkdir -p layer/nodejs/node_modules

if [ -d "node_modules" ]; then
    echo "Copying local node_modules to layer..."
    cp -r node_modules/* layer/nodejs/node_modules/
fi

if [ -d "../node_modules" ]; then
    echo "Copying workspace dependencies to layer..."
    [ -d "../node_modules/date-fns" ] && cp -r ../node_modules/date-fns layer/nodejs/node_modules/
    [ -d "../node_modules/uuid" ] && cp -r ../node_modules/uuid layer/nodejs/node_modules/
    [ -d "../node_modules/tweeter-shared" ] && cp -r ../node_modules/tweeter-shared layer/nodejs/node_modules/
fi

echo "✓ Layer updated successfully"

LAYER_SIZE=$(du -sh layer/nodejs/node_modules | cut -f1)
echo "Layer size: $LAYER_SIZE"

echo ""
echo "Next steps:"
echo "1. Build your TypeScript: npm run build"
echo "2. Deploy with SAM: sam build && sam deploy"
