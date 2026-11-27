ALTER TABLE feedback ADD COLUMN photo_key TEXT;
ALTER TABLE feedback ADD COLUMN photo_content_type TEXT;
ALTER TABLE feedback ADD COLUMN testimonial_photo_consent INTEGER NOT NULL DEFAULT 0 CHECK(testimonial_photo_consent IN (0,1));
