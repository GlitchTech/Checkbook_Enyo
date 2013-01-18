#!/bin/bash
cat <<EOF
=====================
Deploying to Android
=====================
EOF

node enyo/tools/deploy.js -o ../android_gutoc/assets/www/

cp "appinfo.json" "../android_gutoc/assets/www/"
