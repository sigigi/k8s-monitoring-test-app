#!/bin/bash

set -e

APPS=("main-app" "sub1-app" "sub2-app")

for APP in "${APPS[@]}"; do
  echo "🔧 Building $APP..."
  
  rm -f apps/$APP/package*.json

  cp package*.json apps/$APP/

  docker build -f Dockerfile -t $APP:latest ./apps/$APP

  echo "✅ $APP build complete!"
done
