# lemma

## Get Started

### Setup local development environment

Create docker containers for local development. This will setup a local Postgres database, etc.

```bash
yarn setup:local

# You may shutdown the containers with:
yarn shutdown:local
```

### Sync RDS schema with local database

```bash
yarn generate       # Generate @prisma/client with the schema
yarn migrate:local  # Apply the schema to the local database
```

### Install dependencies

```bash
yarn install
```

### Run local development server

```bash
yarn workspace @lemma/http start:dev
```
