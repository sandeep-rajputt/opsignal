CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refresh_token UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    ip_address TEXT,
    location TEXT,
    device TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_session_user_id ON sessions(user_id);
CREATE INDEX idx_session_expires_at ON sessions(refresh_token, expires_at);