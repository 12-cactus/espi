#!/usr/bin/env bash

TUNNEL_DATA=$(curl --silent http://127.0.0.1:4040/api/tunnels |
  jq --raw-output '.tunnels[] | select(.public_url | contains("https"))')

BOT_DOMAIN=$(echo "$TUNNEL_DATA" | jq --raw-output '.public_url')
API_DOMAIN=$(echo "$TUNNEL_DATA" | jq --raw-output '.config.addr')

export API_DOMAIN
export BOT_DOMAIN

echo "API_DOMAIN: $API_DOMAIN"
echo "BOT_DOMAIN: $BOT_DOMAIN"

# Start the bot
ts-node src/index.ts
