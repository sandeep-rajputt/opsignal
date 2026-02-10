CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT DEFAULT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    avatar_public_id TEXT DEFAULT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    primary_workspace VARCHAR(255) DEFAULT NULL,
    slots INTEGER NOT NULL DEFAULT 5,
    notification BOOLEAN NOT NULL DEFAULT FALSE,
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    timezone VARCHAR(255) NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);


CREATE INDEX idx_users_email_not_deleted
ON users(email)
WHERE deleted_at IS NULL;



CREATE INDEX idx_users_name
ON users(name);