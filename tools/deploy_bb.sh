#!/bin/bash
cat <<EOF
================
Deploying to BB
================
EOF

node enyo/tools/deploy.js -o ../bb_gutoc/app/

cp "appinfo.json" "../bb_gutoc/app/"
