#!/usr/bin/env bash

set -x
export "$(cat .env | grep -E -i 'EXPRESS_PORT' | xargs)"

ngrok http "${EXPRESS_PORT}"
