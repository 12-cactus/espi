#!/usr/bin/env bash

set -x
export $(cat .env | egrep -i 'EXPRESS_PORT' | xargs)

lt -h 'http://serverless.social' -p ${EXPRESS_PORT} --subdomain espi
