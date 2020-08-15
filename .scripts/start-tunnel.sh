#!/usr/bin/env bash

set -x
export $(cat .env | egrep -i 'EXPRESS_PORT' | xargs)

ngrok http ${EXPRESS_PORT}
