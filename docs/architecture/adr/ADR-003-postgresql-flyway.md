# ADR-003: PostgreSQL and Flyway

## Status

Accepted

## Context

FanScale needs transactional persistence, relational integrity, immutable financial history, and reproducible environments. Automatic ORM schema mutation is unsafe for production evolution.

## Decision

Use PostgreSQL as the canonical relational database and Flyway for forward, versioned migrations. Use Spring Data JPA where aggregate persistence benefits from it, with `ddl-auto=validate`. Local PostgreSQL runs through Compose; integration tests use Testcontainers. Retain HikariCP defaults until measured requirements exist.

## Consequences

Every schema change requires a reviewed migration and rollback/repair reasoning. Docker is required for integration tests. Backups, restore rehearsals, migration rollback policy, and production pool sizing remain future operational work.
