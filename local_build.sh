#!/bin/bash

set -e

APPS=("main-app" "sub1-app" "sub2-app")

for APP in "${APPS[@]}"; do
  echo "🔧 Building $APP..."
  
  rm -f apps/$APP/package*.json

  cp package*.json apps/$APP/

  # package.json 내 name 필드 앱 이름으로 치환
  jq --arg name "$APP" '.name = $name' \
    apps/$APP/package.json > apps/$APP/package.tmp.json && \
    mv apps/$APP/package.tmp.json apps/$APP/package.json

  docker build -f Dockerfile -t $APP:latest ./apps/$APP

  echo "✅ $APP build complete!"
done
