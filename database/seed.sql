-- Seed data for testing Contentply

-- Insert a test user
INSERT INTO users (email, api_key, plan, status)
VALUES
    ('test@contentply.com', 'ck_test123456789', 'pro', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert usage data for test user
INSERT INTO usage (user_id, api_key, count, month, year)
SELECT
    u.id,
    u.api_key,
    5,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
FROM users u
WHERE u.email = 'test@contentply.com'
ON CONFLICT (api_key, month, year) DO NOTHING;

-- Insert sample content history
INSERT INTO content_history (user_id, api_key, content_preview, content_type, platforms_used)
SELECT
    u.id,
    u.api_key,
    'How to Build a SaaS in 5 Days - Complete Guide',
    'url',
    ARRAY['linkedin', 'twitter', 'instagram']
FROM users u
WHERE u.email = 'test@contentply.com';

INSERT INTO content_history (user_id, api_key, content_preview, content_type, platforms_used)
SELECT
    u.id,
    u.api_key,
    '10 Marketing Strategies That Actually Work',
    'text',
    ARRAY['linkedin', 'email']
FROM users u
WHERE u.email = 'test@contentply.com';
