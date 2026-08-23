CREATE SCHEMA IF NOT EXISTS fanscale;

CREATE TABLE fanscale.foundation_metadata (
    id UUID PRIMARY KEY,
    component VARCHAR(100) NOT NULL UNIQUE,
    schema_version INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

INSERT INTO fanscale.foundation_metadata (id, component, schema_version)
VALUES ('00000000-0000-0000-0000-000000000001', 'backend-foundation', 1)
ON CONFLICT (component) DO NOTHING;

COMMENT ON TABLE fanscale.foundation_metadata IS
    'Infrastructure proof for Flyway, PostgreSQL UUIDs, UTC timestamps, and optimistic-version conventions.';
