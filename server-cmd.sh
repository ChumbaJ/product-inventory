#!/usr/bin/env bash

docker compose version

docker compose -f docker-compose.yml up --detach --pull always

echo "Success!"