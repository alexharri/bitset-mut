#!/bin/bash

PACKAGE_NAME="bitset-mut";

CURRENT_VERSION=$(cat package.json | jq -r '.version');
VERSION_IN_JSON=$(curl -s https://registry.npmjs.org/$PACKAGE_NAME | jq --arg v "$CURRENT_VERSION" -r '.versions[$v].version');

if [ $CURRENT_VERSION == $VERSION_IN_JSON ]; then
  # This version already exists in npm. Should not publish.
  echo FALSE;
else
  # Does not exist in npm. Should publish.
  echo TRUE;
fi
