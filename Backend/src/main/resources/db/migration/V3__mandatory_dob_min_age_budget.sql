-- V3__mandatory_dob_min_age_budget.sql
-- Add date_of_birth to users, min_age to activities and spots, and standardize budget preferences

-- 1. Add date_of_birth column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- 2. Add min_age column to activities and spots (0 = all ages, 18 = 18+ only)
ALTER TABLE activities ADD COLUMN IF NOT EXISTS min_age INT NOT NULL DEFAULT 0;
ALTER TABLE spots ADD COLUMN IF NOT EXISTS min_age INT NOT NULL DEFAULT 0;

-- 3. Standardize existing user_preferences to the 4 official categories:
-- 'Under ₹100', 'Under ₹300', 'Under ₹500', 'Above ₹500'
UPDATE user_preferences SET max_budget = 'Under ₹100' WHERE max_budget IN ('Free', 'Under ₹100');
UPDATE user_preferences SET max_budget = 'Above ₹500' WHERE max_budget IN ('₹500+', 'Above ₹500');
