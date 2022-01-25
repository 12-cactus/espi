#!/usr/bin/env bash

set -x

curl --silent http://127.0.0.1:4040/api/tunnels | grep -oP "https://[a-zA-z0-9-]+.ngrok.io"
