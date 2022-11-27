#!/bin/bash

# This script automates the setup of local dev environment.

main() {
  docker-compose -f $(dirname $0)/docker-compose.yml \
    build

  docker compose -f $(dirname $0)/docker-compose.yml \
    up -d

  # Run database migrations
  yarn workspace @lemma/prisma-client generate
  yarn workspace @lemma/prisma-client migrate:local
}

main $@
