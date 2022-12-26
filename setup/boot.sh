#!/bin/bash

# This script automates the setup of local dev environment.

list_fn() {
  ls packages/ | \
    sed -n 's/^.*lemma__\(.*\):$/\1/p' | \
    awk -F/ '{print $1}' | \
    sort
}

localstack_s3() {
  echo "Creating S3 Buckets ..."
  echo "  - lemma.internal"
  awslocal s3 mb s3://lemma.internal
}

localstack_lambda() {
  echo "Creating Lambda Functions ..."
  for fn in $(list_fn); do
    echo "  - $fn"
    yarn workspace @lemma/$fn deploy:local
  done
}

main() {
  docker-compose -f $(dirname $0)/docker-compose.yml \
    build

  docker compose -f $(dirname $0)/docker-compose.yml \
    up -d

  # Run database migrations
  yarn workspace @lemma/prisma-client generate
  yarn workspace @lemma/prisma-client migrate:local

  # Setup localstack
  localstack_s3
  localstack_lambda
}

main $@
