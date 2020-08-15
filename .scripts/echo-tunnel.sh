#!/usr/bin/env bash

set -x

echo $(curl --silent http://127.0.0.1:4040/api/tunnels | grep -oP "https://\w+.ngrok.io") 
