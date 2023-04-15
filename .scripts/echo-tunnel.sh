#!/usr/bin/env bash

set -x

curl --silent http://127.0.0.1:4040/api/tunnels \
  | jq --raw-output \
    '.tunnels[] | select(.public_url | contains("https")) | .public_url'