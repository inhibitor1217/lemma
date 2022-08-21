-- This configuration is for the local development environment.

-- Development database.
CREATE DATABASE lemma;

-- Create database user for prisma
CREATE USER prisma WITH
  PASSWORD 'prisma'
  CREATEDB; -- Prisma should be able to create shadow databases in dev enviroment.

GRANT ALL PRIVILEGES ON DATABASE lemma TO prisma;
