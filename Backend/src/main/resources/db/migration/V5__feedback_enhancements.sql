-- V5__feedback_enhancements.sql
-- Add visit_date, updated_at, and unique constraint on (user_id, activity_id) to feedback table

ALTER TABLE feedback ADD COLUMN IF NOT EXISTS visit_date DATE;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 1. Deduplicate any existing feedback rows before applying unique constraint
DELETE FROM feedback
WHERE id NOT IN (
    SELECT MAX(id)
    FROM feedback
    GROUP BY user_id, activity_id
);

-- 2. Add unique constraint to ensure one active feedback per user per activity
ALTER TABLE feedback ADD CONSTRAINT uk_feedback_user_activity UNIQUE (user_id, activity_id);

-- 3. Lookup index for activity feedback sorted by newest
CREATE INDEX IF NOT EXISTS idx_feedback_activity_created ON feedback (activity_id, created_at DESC);
