CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refreshToken UUID UNIQUE NOT NULL,
    userId UUID NOT NULL REFERENCES users(id),
    ipAddress TEXT,
    userAgent TEXT,
    expiresAt TIMESTAMPTZ NOT NULL,
    location TEXT,
    device TEXT,
    isRevoked BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_user_id ON sessions(userId);
CREATE INDEX idx_session_expires_at ON sessions(expiresAt)