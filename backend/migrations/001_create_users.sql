-- Enable UUID extension (run this first if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,                      
    password_hash TEXT DEFAULT NULL,                 
    name TEXT NOT NULL,
    avatar_url TEXT,
    email_notification BOOLEAN NOT NULL DEFAULT FALSE,
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),   
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL                          
);

CREATE INDEX idx_users_email_not_deleted
ON users(email)
WHERE deleted_at IS NULL;



CREATE INDEX isx_users_name
ON users(name);