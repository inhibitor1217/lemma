# lemma

## Get Started

### Setup local development environment

Create docker containers for local development. This will setup a local Postgres database, etc.

```bash
yarn setup:local

# You may shutdown the containers with:
yarn shutdown:local
```

### Install dependencies

```bash
yarn install
```

### Sync RDS schema with local database

```bash
yarn workspace @lemma/prisma-client generate       # Generate @prisma/client with the schema
yarn workspace @lemma/prisma-client migrate:local  # Apply the schema to the local database
```

### Run local development server

```bash
yarn workspace @lemma/http start:dev
```
