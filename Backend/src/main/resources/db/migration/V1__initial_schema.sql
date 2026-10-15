-- V1__initial_schema.sql
-- HanginOut Core Schema Definition

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT,
    city VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- 2. Categories Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_categories_name UNIQUE (name)
);

-- 3. Activities Table
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    min_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INT NOT NULL DEFAULT 60,
    best_time VARCHAR(50),
    location_type VARCHAR(50), -- 'Indoor', 'Outdoor', 'Mixed'
    group_type VARCHAR(50),    -- 'Friends', 'Solo', 'Both'
    cover_image_url VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

-- 4. Activity Images (Multiple images for expandable card carousel)
CREATE TABLE activity_images (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    caption VARCHAR(255),
    CONSTRAINT fk_activity_images_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
);

-- 5. Physical Spots / Places Table
CREATE TABLE spots (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(300) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    min_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    opening_hours VARCHAR(150),
    cover_image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Spot Images Table
CREATE TABLE spot_images (
    id BIGSERIAL PRIMARY KEY,
    spot_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_spot_images_spot FOREIGN KEY (spot_id) REFERENCES spots (id) ON DELETE CASCADE
);

-- 7. Activity-Spot Many-to-Many Association
CREATE TABLE activity_spots (
    activity_id BIGINT NOT NULL,
    spot_id BIGINT NOT NULL,
    PRIMARY KEY (activity_id, spot_id),
    CONSTRAINT fk_activity_spots_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_spots_spot FOREIGN KEY (spot_id) REFERENCES spots (id) ON DELETE CASCADE
);

-- 8. User Preferences Table
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    max_budget VARCHAR(50),          -- 'Free', 'Under ₹100', 'Under ₹300', 'Under ₹500', '₹500+'
    preferred_group_type VARCHAR(50),-- 'Friends', 'Solo', 'Any'
    preferred_duration VARCHAR(50),  -- '<1 hour', '1-2 hours', '2-4 hours', '4+ hours'
    city VARCHAR(100),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_preferences_user UNIQUE (user_id),
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 9. User Interests Many-to-Many Table
CREATE TABLE user_interests (
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, category_id),
    CONSTRAINT fk_user_interests_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_interests_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

-- 10. Individual Swipes Table
CREATE TABLE swipes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'LIKE', 'REJECT'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_swipes_user_activity UNIQUE (user_id, activity_id),
    CONSTRAINT fk_swipes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_swipes_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
);

-- 11. Saved Activities Table ("My Hangouts")
CREATE TABLE saved_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_saved_user_activity UNIQUE (user_id, activity_id),
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
);

-- 12. Hangout Groups Table
CREATE TABLE hangout_groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    invite_code VARCHAR(20) NOT NULL,
    creator_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'CLOSED'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_hangout_groups_code UNIQUE (invite_code),
    CONSTRAINT fk_hangout_groups_creator FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE RESTRICT
);

-- 13. Group Members Table
CREATE TABLE group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_group_user UNIQUE (group_id, user_id),
    CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES hangout_groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 14. Group Swipes Table (Collaborative session swiping)
CREATE TABLE group_swipes (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'LIKE', 'REJECT'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_group_swipes_unique UNIQUE (group_id, user_id, activity_id),
    CONSTRAINT fk_group_swipes_group FOREIGN KEY (group_id) REFERENCES hangout_groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_swipes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_swipes_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
);

-- 15. Hangout Plans Table
CREATE TABLE hangout_plans (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    spot_id BIGINT,
    planned_date DATE NOT NULL,
    planned_time TIME WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNED', -- 'PLANNED', 'COMPLETED', 'CANCELLED'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hangout_plans_group FOREIGN KEY (group_id) REFERENCES hangout_groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_hangout_plans_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE,
    CONSTRAINT fk_hangout_plans_spot FOREIGN KEY (spot_id) REFERENCES spots (id) ON DELETE SET NULL
);

-- 16. Feedback Table
CREATE TABLE feedback (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    group_id BIGINT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    enjoyed BOOLEAN NOT NULL DEFAULT TRUE,
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_activity FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_group FOREIGN KEY (group_id) REFERENCES hangout_groups (id) ON DELETE SET NULL
);

-- Performance & Lookup Indexes
CREATE INDEX idx_activities_city_active ON activities (city, is_active);
CREATE INDEX idx_activities_category ON activities (category_id);
CREATE INDEX idx_swipes_user ON swipes (user_id);
CREATE INDEX idx_group_swipes_lookup ON group_swipes (group_id, activity_id);
CREATE INDEX idx_hangout_plans_group ON hangout_plans (group_id);
CREATE INDEX idx_spots_city ON spots (city, is_active);
