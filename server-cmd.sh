#!/usr/bin/env bash

docker-compose -f docker-compose.yml up --detached --pull always

echo "Success!"