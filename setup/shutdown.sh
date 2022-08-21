#!/bin/bash

# This script automates the shutdown of local dev environment.

main() {
  docker compose -f $(dirname $0)/docker-compose.yml \
    down
}

main
