-- 黔行智导 · 数据库表结构 (PostgreSQL 15+)

CREATE TABLE attractions (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    city VARCHAR(32) NOT NULL,
    category VARCHAR(16) NOT NULL DEFAULT 'scenic',
    description TEXT NOT NULL DEFAULT '',
    highlights JSONB DEFAULT '[]',
    tips JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    image_url VARCHAR(512),
    rating NUMERIC(2,1) DEFAULT 0,
    visit_duration VARCHAR(16),
    best_season VARCHAR(32),
    ticket_price VARCHAR(32),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tour_routes (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    day_count INT NOT NULL DEFAULT 1,
    energy_level VARCHAR(8) NOT NULL DEFAULT '适中',
    budget_range VARCHAR(16),
    suitable_crowd JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    attraction_ids JSONB NOT NULL DEFAULT '[]',
    daily_plan JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge_entries (
    id VARCHAR(32) PRIMARY KEY,
    question VARCHAR(256) NOT NULL,
    answer TEXT NOT NULL DEFAULT '',
    category VARCHAR(16) NOT NULL DEFAULT 'tips',
    related_attraction_ids JSONB DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_trips (
    id VARCHAR(36) PRIMARY KEY,
    route_id VARCHAR(32) NOT NULL,
    route_name VARCHAR(128) NOT NULL,
    custom_name VARCHAR(64),
    status VARCHAR(16) NOT NULL DEFAULT 'upcoming',
    day_count INT NOT NULL DEFAULT 1,
    energy_level VARCHAR(8) NOT NULL DEFAULT '适中',
    spot_ids JSONB DEFAULT '[]',
    spot_names JSONB DEFAULT '[]',
    day_plans JSONB DEFAULT '[]',
    safety_checklist JSONB DEFAULT '[]',
    review JSONB DEFAULT '{}',
    travel_start_date VARCHAR(16),
    travel_end_date VARCHAR(16),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_status CHECK (status IN ('upcoming','active','completed'))
);

CREATE TABLE visitor_profiles (
    id VARCHAR(36) PRIMARY KEY,
    interests JSONB NOT NULL DEFAULT '[]',
    days INT NOT NULL DEFAULT 3,
    budget VARCHAR(16),
    crowd VARCHAR(16),
    energy_level VARCHAR(8),
    pace VARCHAR(8),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE interest_tags (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    icon VARCHAR(32),
    category VARCHAR(16) NOT NULL
);

-- Indexes
CREATE INDEX idx_attr_city ON attractions(city);
CREATE INDEX idx_attr_cat ON attractions(category);
CREATE INDEX idx_kb_cat ON knowledge_entries(category);
CREATE INDEX idx_trips_status ON user_trips(status);
CREATE INDEX idx_trips_created ON user_trips(created_at DESC);
