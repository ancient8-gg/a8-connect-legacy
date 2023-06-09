#!/usr/bin/env bash

# clean up
rm -rf dist/
rm -rf dts/
rm -rf build/

# re-create dist
mkdir dist/

# build dts
yarn run gen-dts
cp -r dts/src/* dist/

### build browser exports ###
yarn run build-css
yarn run build:craco:browser

# copy bundles for browser
cp build/browser/browser.js dist/
cp build/static/css/*.css dist/lib.css

### build server exports ###
yarn run build:craco:server
cp build/server/server.js dist/

### build adapter exports ###
yarn run build:craco:adapter
cp build/adapter/adapter.js dist/

# copy resource
cp README.md dist/
cp package.json dist/
cp LICENSE dist/

# clean up
yarn run cleanup