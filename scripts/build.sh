#!/usr/bin/env bash

# clean up
rm -rf dist/
rm -rf dts/
rm -rf build/

# re-create dist
mkdir dist/

# build
yarn run gen-dts
yarn run build-css
yarn run build:craco

# copy bundles
cp -r dts/src/* dist/
cp build/library/lib.entrypoint.js dist/
cp build/static/css/*.css dist/lib.css

# copy resource
cp README.md dist/
cp package.json dist/
cp LICENSE dist/

# clean up
yarn run cleanup