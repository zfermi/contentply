-- Contentply Database Schema
-- PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    api_key VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 0,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(api_key, month, year)
);

-- Content history table
CREATE TABLE IF NOT EXISTS content_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    api_key VARCHAR(255) NOT NULL,
    content_preview TEXT,
    content_type VARCHAR(50), -- 'url' or 'text'
    platforms_used TEXT[], -- Array of platforms
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Repurposed content table (optional - stores generated content)
CREATE TABLE IF NOT EXISTS repurposed_content (
    id SERIAL PRIMARY KEY,
    history_id INTEGER REFERENCES content_history(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    variation_type VARCHAR(100),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_api_key ON users(api_key);
CREATE INDEX idx_usage_api_key ON usage(api_key);
CREATE INDEX idx_usage_month_year ON usage(month, year);
CREATE INDEX idx_content_history_user_id ON content_history(user_id);
CREATE INDEX idx_content_history_created_at ON content_history(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_updated_at BEFORE UPDATE ON usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample queries for common operations

-- Get user by API key
-- SELECT * FROM users WHERE api_key = 'ck_xxx';

-- Check usage for current month
-- SELECT * FROM usage
-- WHERE api_key = 'ck_xxx'
-- AND month = EXTRACT(MONTH FROM CURRENT_DATE)
-- AND year = EXTRACT(YEAR FROM CURRENT_DATE);

-- Increment usage count
-- INSERT INTO usage (user_id, api_key, count, month, year)
-- VALUES (1, 'ck_xxx', 1, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE))
-- ON CONFLICT (api_key, month, year)
-- DO UPDATE SET count = usage.count + 1, updated_at = CURRENT_TIMESTAMP;

-- Get user's content history
-- SELECT * FROM content_history
-- WHERE user_id = 1
-- ORDER BY created_at DESC
-- LIMIT 10;
