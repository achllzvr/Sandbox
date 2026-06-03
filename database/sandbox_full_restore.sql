-- =============================================================================
-- SANDBOX — Full database restore (schema + users + playtest content)
-- =============================================================================
--
-- 1. In phpMyAdmin: drop sandbox_db, create a new empty sandbox_db
-- 2. Select sandbox_db, open the SQL tab, paste this entire file, and run
--
--    CLI alternative:
--    mysql -h 127.0.0.1 -P 3308 -u root sandbox_db < database/sandbox_full_restore.sql
--
-- ACCOUNTS:
--   educavrabina29@gmail.com  → user 9  — Abcd1234! — enrolled FULL DEMO (id 1)
--   roanbaral3@gmail.com      → user 13 — G!G1mu32 — enrolled REACT BASICS (id 2)
--   ahmadpaguta2005@gmail.com → user 11 — password — shop only
--   busiavrabina29@gmail.com  → user 14 — password — shop only
--   cupscuddles@gmail.com     → user 12 — cupsandcuddles — content creator
--   admin@gmail.com           → user 3  — admin123
--
-- COVER IMAGES → storage/app/public/shell-covers/
--   full-demo.jpg | react-basics.jpg | java-basics.jpg | laravel-basics.jpg
--   php artisan storage:link
-- After import, re-extract colors from covers (optional): php artisan certifications:sync-themes
-- =============================================================================

-- =============================================================================
-- SANDBOX — Base schema + playtest user accounts
-- Used by: php artisan db:restore-playtest
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthday DATE NULL,
    contact_no VARCHAR(50) NULL,
    affiliation VARCHAR(255) NULL,
    role ENUM('admin','content_creator','teacher','user') NOT NULL DEFAULT 'user',
    default_certification_id BIGINT UNSIGNED NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    status ENUM('active','inactive','pending_verification','declined') NOT NULL DEFAULT 'active',
    institutional_credentials_url VARCHAR(500) NULL,
    verified_by BIGINT UNSIGNED NULL,
    verified_at TIMESTAMP NULL,
    sand_dollars INT NOT NULL DEFAULT 0,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email),
    KEY users_role_index (role),
    KEY users_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_verifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    resend_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    KEY email_verifications_user_id_foreign (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_invitations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY admin_invitations_email_unique (email),
    UNIQUE KEY admin_invitations_token_unique (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(255) NULL,
    difficulty VARCHAR(255) NULL,
    estimated_duration VARCHAR(255) NULL,
    thumbnail VARCHAR(255) NULL,
    accent_color VARCHAR(7) NULL,
    learning_objectives TEXT NULL,
    prerequisites TEXT NULL,
    tags LONGTEXT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    pass_threshold INT NOT NULL DEFAULT 75,
    status ENUM('draft','pending_approval','pending_review','revision_required','approved','published','declined','denied') NOT NULL DEFAULT 'draft',
    remarks TEXT NULL,
    submitted_at TIMESTAMP NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    decline_reason TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY certifications_status_index (status),
    KEY certifications_created_by_user_id_foreign (created_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    certification_id BIGINT UNSIGNED NOT NULL,
    created_by_user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY lessons_certification_id_foreign (certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS modules (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    lesson_id BIGINT UNSIGNED NOT NULL,
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    uploaded_by_content_creator_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    strict_completion TINYINT(1) NOT NULL DEFAULT 0,
    order_index INT NOT NULL DEFAULT 1,
    sequence INT NOT NULL DEFAULT 1,
    start_date DATE NULL,
    end_date DATE NULL,
    duration_days INT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY modules_lesson_id_foreign (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS module_content (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    module_id BIGINT UNSIGNED NOT NULL,
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    content_type ENUM('video','presentation','document','youtube_embed','other') NOT NULL,
    title VARCHAR(150) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY module_content_module_id_foreign (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_materials (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    certification_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('ppt','document','youtube_video') NOT NULL,
    file_path VARCHAR(255) NULL,
    youtube_embed_url VARCHAR(255) NULL,
    description TEXT NULL,
    order_number INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    KEY learning_materials_certification_id_foreign (certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS questions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    module_id BIGINT UNSIGNED NULL,
    certification_id BIGINT UNSIGNED NULL,
    learning_material_id BIGINT UNSIGNED NULL,
    created_by_user_id BIGINT UNSIGNED NULL,
    question_type ENUM('diagnostic','module_quiz','final_exam','fast_track') NOT NULL DEFAULT 'module_quiz',
    interaction_type VARCHAR(32) NOT NULL DEFAULT 'multiple_choice',
    metadata JSON NULL,
    question_text TEXT NOT NULL,
    points INT NOT NULL DEFAULT 1,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY questions_module_id_foreign (module_id),
    KEY questions_certification_id_foreign (certification_id),
    KEY questions_question_type_index (question_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS answers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    question_id BIGINT UNSIGNED NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY answers_question_id_foreign (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    certification_id BIGINT UNSIGNED NOT NULL,
    enrollment_request_id BIGINT UNSIGNED NULL,
    voucher_id BIGINT UNSIGNED NULL,
    access_type ENUM('direct_purchase','voucher','admin_grant') NOT NULL DEFAULT 'direct_purchase',
    status ENUM('active','completed','revoked') NOT NULL DEFAULT 'active',
    enrolled_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY enrollments_user_id_foreign (user_id),
    KEY enrollments_certification_id_foreign (certification_id),
    KEY enrollments_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enrollment_requests (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    certification_id BIGINT UNSIGNED NOT NULL,
    request_type ENUM('direct_purchase','teacher_bulk') NOT NULL DEFAULT 'direct_purchase',
    quantity INT NOT NULL DEFAULT 1,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending','paid','approved','rejected','failed','cancelled') NOT NULL DEFAULT 'pending',
    payment_proof_url VARCHAR(500) NULL,
    payment_reference VARCHAR(255) NULL,
    payment_method VARCHAR(100) NULL,
    requested_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY enrollment_requests_user_id_foreign (user_id),
    KEY enrollment_requests_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    enrollment_request_id BIGINT UNSIGNED NOT NULL,
    processed_by BIGINT UNSIGNED NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'xendit',
    provider_invoice_id VARCHAR(255) NULL,
    provider_reference VARCHAR(255) NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','paid','failed','expired','cancelled','refunded') NOT NULL DEFAULT 'pending',
    method VARCHAR(100) NULL,
    paid_at TIMESTAMP NULL,
    raw_payload LONGTEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY payments_provider_invoice_id_unique (provider_invoice_id),
    KEY payments_enrollment_request_id_foreign (enrollment_request_id),
    KEY payments_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vouchers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    enrollment_request_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NULL,
    cohort_id BIGINT UNSIGNED NULL,
    certification_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_used TINYINT(1) NOT NULL DEFAULT 0,
    used_by BIGINT UNSIGNED NULL,
    issued_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY vouchers_code_unique (code),
    KEY vouchers_certification_id_foreign (certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cohorts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    teacher_id BIGINT UNSIGNED NOT NULL,
    certification_id BIGINT UNSIGNED NULL,
    cohort_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY cohorts_teacher_id_foreign (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cohort_students (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    cohort_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    voucher_id BIGINT UNSIGNED NULL,
    joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY cohort_students_cohort_id_foreign (cohort_id),
    KEY cohort_students_user_id_foreign (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_attempts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    certification_id BIGINT UNSIGNED NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    passed TINYINT(1) NOT NULL DEFAULT 0,
    attempted_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY exam_attempts_user_id_foreign (user_id),
    KEY exam_attempts_passed_index (passed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_attempt_answers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    attempt_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    selected_answer_id BIGINT UNSIGNED NULL,
    is_correct TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY exam_attempt_answers_attempt_id_foreign (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    certification_id BIGINT UNSIGNED NOT NULL,
    exam_attempt_id BIGINT UNSIGNED NOT NULL,
    certificate_code VARCHAR(100) NOT NULL,
    status ENUM('valid','revoked') NOT NULL DEFAULT 'valid',
    issued_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY certificates_certificate_code_unique (certificate_code),
    KEY certificates_user_id_foreign (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_module_progress (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    module_id BIGINT UNSIGNED NOT NULL,
    is_unlocked TINYINT(1) NOT NULL DEFAULT 0,
    is_completed TINYINT(1) NOT NULL DEFAULT 0,
    fast_track_used TINYINT(1) NOT NULL DEFAULT 0,
    fast_track_passed TINYINT(1) NOT NULL DEFAULT 0,
    content_completed TINYINT(1) NOT NULL DEFAULT 0,
    score INT NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_module_progress_user_id_foreign (user_id),
    KEY user_module_progress_is_completed_index (is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_streaks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_active_date DATE NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY user_streaks_user_id_unique (user_id),
    KEY user_streaks_longest_streak_index (longest_streak)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gamification_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    source_type VARCHAR(64) NULL,
    source_id BIGINT UNSIGNED NULL,
    meta JSON NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY gamification_events_user_id_created_at_index (user_id, created_at),
    KEY gamification_events_event_type_index (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(64) NOT NULL,
    label VARCHAR(150) NOT NULL,
    icon VARCHAR(16) NOT NULL DEFAULT '⭐',
    description TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY achievements_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    achievement_id BIGINT UNSIGNED NOT NULL,
    unlocked_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY user_achievements_user_achievement_unique (user_id, achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS daily_quests (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(64) NOT NULL,
    label VARCHAR(200) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    target INT UNSIGNED NOT NULL DEFAULT 1,
    reward_sd INT UNSIGNED NOT NULL DEFAULT 10,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY daily_quests_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_daily_quest_progress (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    daily_quest_id BIGINT UNSIGNED NOT NULL,
    quest_date DATE NOT NULL,
    progress INT UNSIGNED NOT NULL DEFAULT 0,
    is_claimed TINYINT(1) NOT NULL DEFAULT 0,
    claimed_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY user_quest_date_unique (user_id, daily_quest_id, quest_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cosmetic_items (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    type ENUM('hat','shell','background','accessory') NOT NULL,
    price INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY cosmetic_items_type_index (type),
    KEY cosmetic_items_is_active_index (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_cosmetics (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_cosmetics_user_id_foreign (user_id),
    KEY user_cosmetics_item_id_foreign (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS equipped_cosmetics (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    equipped_hat VARCHAR(100) NULL,
    equipped_shell VARCHAR(100) NULL,
    equipped_background VARCHAR(100) NULL,
    equipped_accessory VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY equipped_cosmetics_user_id_unique (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS creator_earnings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    creator_id BIGINT UNSIGNED NOT NULL,
    certification_id BIGINT UNSIGNED NOT NULL,
    payment_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','available','withdrawn','cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY creator_earnings_creator_id_foreign (creator_id),
    KEY creator_earnings_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS revenue_splits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    certification_id BIGINT UNSIGNED NOT NULL,
    admin_percentage DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    creator_percentage DECIMAL(5,2) NOT NULL DEFAULT 70.00,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY revenue_splits_certification_id_unique (certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    creator_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','approved','paid','declined') NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    remarks TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY withdrawal_requests_creator_id_foreign (creator_id),
    KEY withdrawal_requests_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(255) NOT NULL,
    details LONGTEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY audit_logs_user_id_foreign (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    queue VARCHAR(255) NOT NULL,
    payload LONGTEXT NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL,
    reserved_at INT UNSIGNED NULL,
    available_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    KEY jobs_queue_index (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(255) NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload LONGTEXT NOT NULL,
    exception LONGTEXT NOT NULL,
    failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY failed_jobs_uuid_unique (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY personal_access_tokens_token_unique (token),
    KEY personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS migrations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    migration VARCHAR(255) NOT NULL,
    batch INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Playtest accounts (IDs must match student_playtest_seed.sql)
INSERT INTO users (
    id, first_name, last_name, email, password, birthday, contact_no, affiliation,
    role, is_active, status, sand_dollars, email_verified_at, created_at, updated_at
) VALUES
(3, 'Admin', 'User', 'admin@gmail.com',
 '$2y$12$g1vnPm68wDAb5RpuNWmv8.AdccWhjAGKfSWPYke0icnQJ3dBQHAlS',
 '2000-01-01', '09123456789', 'System Admin', 'admin', 1, 'active', 0, NOW(), NOW(), NOW()),
(9, 'Chi', 'Ligma', 'educavrabina29@gmail.com',
 '$2y$12$aKWF3rbf4PCEJ/sUkoGQBOUIbR7Axt3CrquWw314w57Jh2u5RT9za',
 '2000-05-29', '09171234567', 'Playtest Student', 'user', 1, 'active', 0, NOW(), NOW(), NOW()),
(11, 'Ahmad', 'Paguta', 'ahmadpaguta2005@gmail.com',
 '$2y$12$BlAStaFZdhPiLcNpA7bbxOCp2WaDIn3uhFCQJNlrY26qnmvMEhZZm',
 '2005-01-01', '09181234567', 'Playtest Student', 'user', 1, 'active', 0, NOW(), NOW(), NOW()),
(12, 'Cups', 'Cuddles', 'cupscuddles@gmail.com',
 '$2y$12$3gECeTWwYOU9ZK7clN/sXumqiwZrXAqJGRR6WpmKOeD0CaPqZyNZa',
 '1998-03-15', '09191234567', 'Content Creator', 'content_creator', 1, 'active', 0, NOW(), NOW(), NOW()),
(13, 'Roan', 'Baral', 'roanbaral3@gmail.com',
 '$2y$12$P9gf.a2ei5FcJeSaYvKcbuEgeaankcTnbIhAby7vlmqQc56Nki45W',
 '2001-07-20', '09201234567', 'Playtest Student', 'user', 1, 'active', 0, NOW(), NOW(), NOW()),
(14, 'Busi', 'Avrabina', 'busiavrabina29@gmail.com',
 '$2y$12$BlAStaFZdhPiLcNpA7bbxOCp2WaDIn3uhFCQJNlrY26qnmvMEhZZm',
 '2000-08-29', '09211234567', 'Playtest Student', 'user', 1, 'active', 0, NOW(), NOW(), NOW());

ALTER TABLE users AUTO_INCREMENT = 15;

-- ── Playtest shells, quizzes, enrollments ─────────────────────────────────

START TRANSACTION;

UPDATE users SET sand_dollars = 0, default_certification_id = NULL WHERE role = 'user';
UPDATE users SET default_certification_id = 1 WHERE id = 9;
UPDATE users SET default_certification_id = 2 WHERE id = 13;

INSERT INTO certifications (
    id, title, description, category, difficulty, estimated_duration, thumbnail, accent_color,
    learning_objectives, prerequisites, tags, price, pass_threshold, status,
    submitted_at, created_by_user_id, approved_by, approved_at, created_at, updated_at
) VALUES
(1, 'FULL DEMO', '10 sandboxes, 4 units, quizzes on #3/#7/#10, final exam.', 'Demo', 'Beginner', '2 hours', 'shell-covers/full-demo.jpg', '#f08070', 'Full student journey.', 'None', '["demo"]', 0.00, 70, 'published', NOW(), 12, 3, NOW(), NOW(), NOW()),
(2, 'REACT BASICS', '10 sandboxes, 4 units, quizzes on #3/#5, final exam.', 'Technology', 'Beginner', '4 hours', 'shell-covers/react-basics.jpg', '#60b0f0', 'Build UI with React.', 'HTML & JS', '["react"]', 0.00, 75, 'published', NOW(), 12, 3, NOW(), NOW(), NOW()),
(3, 'JAVA BASICS', '10 sandboxes, 4 units, quizzes on #3/#5, final exam.', 'Technology', 'Intermediate', '6 hours', 'shell-covers/java-basics.jpg', '#f07060', 'Core Java skills.', 'Programming logic', '["java"]', 499.00, 75, 'published', NOW(), 12, 3, NOW(), NOW(), NOW()),
(4, 'LARAVEL BASICS', '10 sandboxes, 4 units, quizzes on #3/#5, final exam.', 'Technology', 'Intermediate', '5 hours', 'shell-covers/laravel-basics.jpg', '#f02020', 'Laravel MVC.', 'PHP basics', '["laravel"]', 799.00, 75, 'published', NOW(), 12, 3, NOW(), NOW(), NOW());

INSERT INTO enrollments (user_id, certification_id, access_type, status, enrolled_at, created_at, updated_at) VALUES
(9, 1, 'admin_grant', 'active', NOW(), NOW(), NOW()),
(13, 2, 'admin_grant', 'active', NOW(), NOW(), NOW());

INSERT INTO lessons (id, certification_id, created_by_user_id, title, description, order_index) VALUES
(11, 1, 12, 'UNIT 1 — FOUNDATIONS', 'Start here.', 1),
(12, 1, 12, 'UNIT 2 — CORE SKILLS', 'Core skills.', 2),
(13, 1, 12, 'UNIT 3 — ADVANCED TOPICS', 'Go deeper.', 3),
(14, 1, 12, 'UNIT 4 — CHECKPOINT', 'Review.', 4),
(21, 2, 12, 'UNIT 1 — REACT FUNDAMENTALS', 'Components.', 1),
(22, 2, 12, 'UNIT 2 — STATE & HOOKS', 'Hooks.', 2),
(23, 2, 12, 'UNIT 3 — REACT PATTERNS', 'Patterns and performance.', 3),
(24, 2, 12, 'UNIT 4 — REACT CAPSTONE', 'Capstone review.', 4),
(31, 3, 12, 'UNIT 1 — JAVA CORE', 'OOP.', 1),
(32, 3, 12, 'UNIT 2 — COLLECTIONS', 'Collections.', 2),
(33, 3, 12, 'UNIT 3 — JAVA ADVANCED', 'Advanced Java.', 3),
(34, 3, 12, 'UNIT 4 — JAVA CAPSTONE', 'Capstone review.', 4),
(41, 4, 12, 'UNIT 1 — LARAVEL MVC', 'MVC.', 1),
(42, 4, 12, 'UNIT 2 — ELOQUENT & BLADE', 'DB & views.', 2),
(43, 4, 12, 'UNIT 3 — LARAVEL ADVANCED', 'Advanced Laravel.', 3),
(44, 4, 12, 'UNIT 4 — LARAVEL CAPSTONE', 'Capstone review.', 4);

INSERT INTO modules (id, lesson_id, uploaded_by_user_id, uploaded_by_content_creator_id, title, description, strict_completion, order_index, sequence) VALUES
(101, 11, 12, 12, 'Welcome to the Sandbox', NULL, 0, 1, 1),
(102, 11, 12, 12, 'Your First Shell', NULL, 0, 2, 2),
(103, 11, 12, 12, 'Foundations Quiz', NULL, 0, 3, 3),
(104, 12, 12, 12, 'Building Blocks', NULL, 0, 1, 4),
(105, 12, 12, 12, 'Practice Drill', NULL, 0, 2, 5),
(106, 12, 12, 12, 'Skill Check', NULL, 0, 3, 6),
(107, 13, 12, 12, 'Advanced Quiz', NULL, 0, 1, 7),
(108, 13, 12, 12, 'Deep Dive', NULL, 0, 2, 8),
(109, 13, 12, 12, 'Applied Concepts', NULL, 0, 3, 9),
(110, 14, 12, 12, 'Unit Review Quiz', NULL, 0, 1, 10),
(201, 21, 12, 12, 'What is React?', NULL, 0, 1, 1),
(202, 21, 12, 12, 'Components & JSX', NULL, 0, 2, 2),
(203, 21, 12, 12, 'React Checkpoint Quiz', NULL, 0, 3, 3),
(204, 22, 12, 12, 'State & Hooks', NULL, 0, 1, 4),
(205, 22, 12, 12, 'Hooks Quiz', NULL, 0, 2, 5),
(301, 31, 12, 12, 'Java & the JVM', NULL, 0, 1, 1),
(302, 31, 12, 12, 'OOP in Java', NULL, 0, 2, 2),
(303, 31, 12, 12, 'Java OOP Quiz', NULL, 0, 3, 3),
(304, 32, 12, 12, 'Collections Framework', NULL, 0, 1, 4),
(305, 32, 12, 12, 'Collections Quiz', NULL, 0, 2, 5),
(401, 41, 12, 12, 'Laravel Overview', NULL, 0, 1, 1),
(402, 41, 12, 12, 'Routing & Controllers', NULL, 0, 2, 2),
(403, 41, 12, 12, 'Routing Quiz', NULL, 0, 3, 3),
(404, 42, 12, 12, 'Eloquent ORM', NULL, 0, 1, 4),
(405, 42, 12, 12, 'Blade & Views Quiz', NULL, 0, 2, 5),
(206, 23, 12, 12, 'Context API', NULL, 0, 1, 6),
(207, 23, 12, 12, 'Performance Tips', NULL, 0, 2, 7),
(208, 23, 12, 12, 'Testing Basics', NULL, 0, 3, 8),
(209, 24, 12, 12, 'Project Workshop', NULL, 0, 1, 9),
(210, 24, 12, 12, 'React Capstone Review', NULL, 0, 2, 10),
(306, 33, 12, 12, 'Generics & Streams', NULL, 0, 1, 6),
(307, 33, 12, 12, 'Exception Handling', NULL, 0, 2, 7),
(308, 33, 12, 12, 'File I/O', NULL, 0, 3, 8),
(309, 34, 12, 12, 'Java Workshop', NULL, 0, 1, 9),
(310, 34, 12, 12, 'Java Capstone Review', NULL, 0, 2, 10),
(406, 43, 12, 12, 'Middleware & Requests', NULL, 0, 1, 6),
(407, 43, 12, 12, 'Validation & Policies', NULL, 0, 2, 7),
(408, 43, 12, 12, 'Queues & Jobs', NULL, 0, 3, 8),
(409, 44, 12, 12, 'Laravel Workshop', NULL, 0, 1, 9),
(410, 44, 12, 12, 'Laravel Capstone Review', NULL, 0, 2, 10);

INSERT INTO module_content (module_id, uploaded_by_user_id, content_type, title, file_url, order_index) VALUES
(101, 12, 'youtube_embed', 'Welcome', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(102, 12, 'youtube_embed', 'Walkthrough', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(104, 12, 'youtube_embed', 'Building blocks', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(105, 12, 'youtube_embed', 'Practice', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(106, 12, 'youtube_embed', 'Skill check', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(108, 12, 'youtube_embed', 'Deep dive', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(109, 12, 'youtube_embed', 'Applied', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(110, 12, 'youtube_embed', 'Review intro', 'https://www.youtube.com/embed/EngW7tLk6R8', 1),
(201, 12, 'youtube_embed', 'React intro', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(202, 12, 'youtube_embed', 'Components', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(204, 12, 'youtube_embed', 'Hooks', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(301, 12, 'youtube_embed', 'Java intro', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(302, 12, 'youtube_embed', 'OOP', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(304, 12, 'youtube_embed', 'Collections', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(401, 12, 'youtube_embed', 'Laravel intro', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(402, 12, 'youtube_embed', 'Routing', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(404, 12, 'youtube_embed', 'Eloquent', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(206, 12, 'youtube_embed', 'Context API', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(207, 12, 'youtube_embed', 'Performance', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(208, 12, 'youtube_embed', 'Testing', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(209, 12, 'youtube_embed', 'Workshop', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(210, 12, 'youtube_embed', 'Capstone', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1),
(306, 12, 'youtube_embed', 'Generics', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(307, 12, 'youtube_embed', 'Exceptions', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(308, 12, 'youtube_embed', 'File I/O', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(309, 12, 'youtube_embed', 'Workshop', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(310, 12, 'youtube_embed', 'Capstone', 'https://www.youtube.com/embed/eIrMbAQSU34', 1),
(406, 12, 'youtube_embed', 'Middleware', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(407, 12, 'youtube_embed', 'Validation', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(408, 12, 'youtube_embed', 'Queues', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(409, 12, 'youtube_embed', 'Workshop', 'https://www.youtube.com/embed/Imx223jqqEE', 1),
(410, 12, 'youtube_embed', 'Capstone', 'https://www.youtube.com/embed/Imx223jqqEE', 1);

-- ── FULL DEMO questions ───────────────────────────────────────────────────────
INSERT INTO questions (id, module_id, certification_id, created_by_user_id, question_type, question_text, order_index) VALUES
(10001, 103, 1, 12, 'module_quiz', 'What is a sandbox in this app?', 1),
(10002, 103, 1, 12, 'module_quiz', 'How do you unlock the next sandbox?', 2),
(10003, 103, 1, 12, 'module_quiz', 'What icon marks a quiz-only sandbox?', 3),
(10004, 103, 1, 12, 'module_quiz', 'Where does Hermy appear on the map?', 4),
(10005, 103, 1, 12, 'module_quiz', 'What unlocks after all sandboxes are done?', 5),
(10006, 107, 1, 12, 'module_quiz', 'Shell theme colors use…', 1),
(10007, 107, 1, 12, 'module_quiz', 'Sandbox popups use…', 2),
(10008, 107, 1, 12, 'module_quiz', 'Final exam unlock requires…', 3),
(10009, 107, 1, 12, 'module_quiz', 'Each module quiz has at most…', 4),
(10010, 107, 1, 12, 'module_quiz', 'Completed sandboxes show as…', 5),
(10011, 110, 1, 12, 'module_quiz', 'How many units in FULL DEMO?', 1),
(10012, 110, 1, 12, 'module_quiz', 'Quiz-only sandboxes are…', 2),
(10013, 110, 1, 12, 'module_quiz', 'Bottom of the map has…', 3),
(10014, 110, 1, 12, 'module_quiz', 'Enrollment gives access to…', 4),
(10015, 110, 1, 12, 'module_quiz', 'FULL DEMO pass threshold is…', 5),
(10101, NULL, 1, 12, 'final_exam', 'Sandboxes in FULL DEMO?', 1),
(10102, NULL, 1, 12, 'final_exam', 'This shell title is…', 2),
(10103, NULL, 1, 12, 'final_exam', 'Quiz sandboxes use icon…', 3),
(10104, NULL, 1, 12, 'final_exam', 'Passing final exam awards…', 4),
(10105, NULL, 1, 12, 'final_exam', 'Units separated by…', 5);

INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(10001,'Payment receipt',0),(10001,'Interactive learning module',1),(10001,'Profile badge',0),(10001,'Admin panel',0),
(10002,'Pay again',0),(10002,'Skip to exam',0),(10002,'Complete previous sandbox',1),(10002,'Delete account',0),
(10003,'Castle only',0),(10003,'Home icon',0),(10003,'Logout',0),(10003,'Shovel/quiz icon',1),
(10004,'Beside path on right',1),(10004,'Title banner only',0),(10004,'Shop only',0),(10004,'Never shown',0),
(10005,'App resets',0),(10005,'Final exam unlocks',1),(10005,'Lose sand dollars',0),(10005,'Nothing',0),
(10006,'Random color',0),(10006,'Alphabetical',0),(10006,'Cert ID theme key',1),(10006,'Always pink',0),
(10007,'Gray modal',0),(10007,'No popups',0),(10007,'Black/yellow',0),(10007,'Shell color + white CTA',1),
(10008,'All sandboxes done',1),(10008,'Any one sandbox',0),(10008,'Pay twice',0),(10008,'Admin only',0),
(10009,'One question',0),(10009,'Five questions',1),(10009,'Unlimited',0),(10009,'Zero',0),
(10010,'Hidden',0),(10010,'Deleted',0),(10010,'Checkmark/done',1),(10010,'Shop item',0),
(10011,'Two',0),(10011,'Ten',0),(10011,'One',0),(10011,'Four',1),
(10012,'Sandboxes 3,7,10',1),(10012,'1 and 2 only',0),(10012,'Exam only',0),(10012,'None',0),
(10013,'Second Hermy',0),(10013,'Sandcastle exam',1),(10013,'Shop link',0),(10013,'Blank',0),
(10014,'Admin dash',0),(10014,'Profiles',0),(10014,'That shell map',1),(10014,'Nothing',0),
(10015,'100%',0),(10015,'0%',0),(10015,'50%',0),(10015,'70%',1),
(10101,'Five',0),(10101,'Ten',1),(10101,'Two',0),(10101,'None',0),
(10102,'REACT BASICS',0),(10102,'JAVA BASICS',0),(10102,'FULL DEMO',1),(10102,'LARAVEL',0),
(10103,'Castle',0),(10103,'Cart',0),(10103,'Trophy',0),(10103,'Shovel/quiz',1),
(10104,'Hermit certificate',1),(10104,'Admin role',0),(10104,'All shells free',0),(10104,'Delete quizzes',0),
(10105,'Random shuffle',0),(10105,'Unit dividers',1),(10105,'New account',0),(10105,'Receipts',0);

-- ── REACT BASICS ────────────────────────────────────────────────────────────
INSERT INTO questions (id, module_id, certification_id, created_by_user_id, question_type, question_text, order_index) VALUES
(20001, 203, 2, 12, 'module_quiz', 'React is for…', 1),
(20002, 203, 2, 12, 'module_quiz', 'JSX is…', 2),
(20003, 203, 2, 12, 'module_quiz', 'Components must…', 3),
(20004, 203, 2, 12, 'module_quiz', 'Props are…', 4),
(20005, 203, 2, 12, 'module_quiz', 'Virtual DOM…', 5),
(20006, 205, 2, 12, 'module_quiz', 'useState returns…', 1),
(20007, 205, 2, 12, 'module_quiz', 'useEffect runs…', 2),
(20008, 205, 2, 12, 'module_quiz', 'Lifting state up…', 3),
(20009, 205, 2, 12, 'module_quiz', 'List keys…', 4),
(20010, 205, 2, 12, 'module_quiz', 'Strict Mode…', 5),
(20101, NULL, 2, 12, 'final_exam', 'React maintained by…', 1),
(20102, NULL, 2, 12, 'final_exam', 'createRoot is…', 2),
(20103, NULL, 2, 12, 'final_exam', 'Controlled input uses…', 3),
(20104, NULL, 2, 12, 'final_exam', 'Fragment is…', 4),
(20105, NULL, 2, 12, 'final_exam', 'React 18 improves…', 5);

INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(20001,'SQL',0),(20001,'Bytecode',0),(20001,'Building UIs',1),(20001,'Static files',0),
(20002,'SQL inline',0),(20002,'PHP only',0),(20002,'Binary',0),(20002,'HTML-like JS markup',1),
(20003,'Return UI output',1),(20003,'Never functions',0),(20003,'Server only',0),(20003,'No props',0),
(20004,'Globals',0),(20004,'Parent→child inputs',1),(20004,'CSS only',0),(20004,'DB strings',0),
(20005,'Skip diff',0),(20005,'Replace HTTP',0),(20005,'Batch updates via diff',1),(20005,'Hash passwords',0),
(20006,'Setter only',0),(20006,'DOM node',0),(20006,'CSS class',0),(20006,'Value + setter',1),
(20007,'After render commit',1),(20007,'Every keystroke',0),(20007,'Unmount only',0),(20007,'Never in FC',0),
(20008,'Delete props',0),(20008,'Shared state in ancestor',1),(20008,'Disable hooks',0),(20008,'Classes only',0),
(20009,'Encrypt',0),(20009,'Remove keys',0),(20009,'Track identity',1),(20009,'Sort A-Z',0),
(20010,'Disable hooks',0),(20010,'Ship prod 2x',0),(20010,'Block JSX',0),(20010,'Double-invoke effects',1),
(20101,'Oracle',0),(20101,'Microsoft',0),(20101,'Meta',1),(20101,'Apple',0),
(20102,'ReactDOM.render',0),(20102,'jQuery',0),(20102,'Vue',0),(20102,'React 18 createRoot',1),
(20103,'State + onChange',1),(20103,'Cookie only',0),(20103,'localStorage only',0),(20103,'Refs only',0),
(20104,'div required',0),(20104,'<> or Fragment',1),(20104,'section only',0),(20104,'No group',0),
(20105,'PHP routes',0),(20105,'MySQL',0),(20105,'Rendering/transitions',1),(20105,'Email',0);

-- Re-jumble a few FULL DEMO / REACT items so correct ≠ A
DELETE FROM answers WHERE question_id IN (10004,10008,10012,10104,20003,20007,20103);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(10004,'Title banner only',0),(10004,'Shop only',0),(10004,'Never shown',0),(10004,'Beside path on right',1),
(10008,'Any one sandbox',0),(10008,'Pay twice',0),(10008,'All sandboxes done',1),(10008,'Admin only',0),
(10012,'1 and 2 only',0),(10012,'Sandboxes 3,7,10',1),(10012,'Exam only',0),(10012,'None',0),
(10104,'Admin role',0),(10104,'All shells free',0),(10104,'Delete quizzes',0),(10104,'Hermit certificate',1),
(20003,'Never functions',0),(20003,'Server only',0),(20003,'Return UI output',1),(20003,'No props',0),
(20007,'Every keystroke',0),(20007,'After render commit',1),(20007,'Unmount only',0),(20007,'Never in FC',0),
(20103,'Cookie only',0),(20103,'localStorage only',0),(20103,'Refs only',0),(20103,'State + onChange',1);

-- ── JAVA BASICS ─────────────────────────────────────────────────────────────
INSERT INTO questions (id, module_id, certification_id, created_by_user_id, question_type, question_text, order_index) VALUES
(30001, 303, 3, 12, 'module_quiz', 'Java is…', 1),
(30002, 303, 3, 12, 'module_quiz', 'JVM stands for…', 2),
(30003, 303, 3, 12, 'module_quiz', 'Encapsulation means…', 3),
(30004, 303, 3, 12, 'module_quiz', 'extends keyword…', 4),
(30005, 303, 3, 12, 'module_quiz', 'Interface vs class…', 5),
(30006, 305, 3, 12, 'module_quiz', 'ArrayList is…', 1),
(30007, 305, 3, 12, 'module_quiz', 'HashMap stores…', 2),
(30008, 305, 3, 12, 'module_quiz', 'Generics provide…', 3),
(30009, 305, 3, 12, 'module_quiz', 'Iterator allows…', 4),
(30010, 305, 3, 12, 'module_quiz', 'Set vs List…', 5),
(30101, NULL, 3, 12, 'final_exam', 'main method is…', 1),
(30102, NULL, 3, 12, 'final_exam', 'static means…', 2),
(30103, NULL, 3, 12, 'final_exam', 'final variable…', 3),
(30104, NULL, 3, 12, 'final_exam', 'Checked exception…', 4),
(30105, NULL, 3, 12, 'final_exam', 'Package java.util has…', 5);

DELETE FROM answers WHERE question_id BETWEEN 30001 AND 30105;
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(30001,'Markup language',0),(30001,'OS kernel',0),(30001,'Object-oriented language',1),(30001,'Browser',0),
(30002,'Java Visual Module',0),(30002,'Joint Version Manager',0),(30002,'Java Virtual Machine',1),(30002,'JSON VM',0),
(30003,'Delete fields',0),(30003,'No classes',0),(30003,'Only static',0),(30003,'Hide data + expose methods',1),
(30004,'Inheritance',1),(30004,'Compilation',0),(30004,'Garbage only',0),(30004,'Thread start',0),
(30005,'Interface always concrete',0),(30005,'Interface defines contract',1),(30005,'Class cannot implement',0),(30005,'Same as enum',0);

DELETE FROM answers WHERE question_id BETWEEN 30006 AND 30010;
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(30006,'Hash table only',0),(30006,'Resizable array list',1),(30006,'Stack only',0),(30006,'Tree map',0),
(30007,'Sorted set',0),(30007,'Primitive stack',0),(30007,'Key-value pairs',1),(30007,'HTML nodes',0),
(30008,'Runtime only',0),(30008,'No types',0),(30008,'Type safety at compile time',1),(30008,'CSS',0),
(30009,'SQL queries',0),(30009,'Sequential traversal',1),(30009,'HTTP',0),(30009,'File delete',0),
(30010,'List no order',0),(30010,'Set indexed',0),(30010,'Same thing',0),(30010,'Set no duplicates',1);

DELETE FROM answers WHERE question_id BETWEEN 30101 AND 30105;
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(30101,'Private ctor only',0),(30101,'Entry point static void',1),(30101,'Deprecated',0),(30101,'Interface',0),
(30102,'Mutable global',0),(30102,'Belongs to class not instance',1),(30102,'Same as final',0),(30102,'Thread lock',0),
(30103,'Must be public',0),(30103,'Auto GC',0),(30103,'Cannot reassign reference',1),(30103,'Interface',0),
(30104,'Never thrown',0),(30104,'Runtime only',0),(30104,'Must handle or declare',1),(30104,'CSS error',0),
(30105,'Swing only',0),(30105,'SQL only',0),(30105,'HTTP server',0),(30105,'Collections framework',1);

-- ── LARAVEL BASICS ──────────────────────────────────────────────────────────
INSERT INTO questions (id, module_id, certification_id, created_by_user_id, question_type, question_text, order_index) VALUES
(40001, 403, 4, 12, 'module_quiz', 'Laravel is a…', 1),
(40002, 403, 4, 12, 'module_quiz', 'routes/web.php defines…', 2),
(40003, 403, 4, 12, 'module_quiz', 'Controller job…', 3),
(40004, 403, 4, 12, 'module_quiz', 'Middleware…', 4),
(40005, 403, 4, 12, 'module_quiz', 'Route::get 2nd arg…', 5),
(40006, 405, 4, 12, 'module_quiz', 'Eloquent is…', 1),
(40007, 405, 4, 12, 'module_quiz', 'Blade files live in…', 2),
(40008, 405, 4, 12, 'module_quiz', '@csrf directive…', 3),
(40009, 405, 4, 12, 'module_quiz', 'Migration files…', 4),
(40010, 405, 4, 12, 'module_quiz', 'artisan migrate…', 5),
(40101, NULL, 4, 12, 'final_exam', '.env stores…', 1),
(40102, NULL, 4, 12, 'final_exam', 'Service container…', 2),
(40103, NULL, 4, 12, 'final_exam', 'Validation uses…', 3),
(40104, NULL, 4, 12, 'final_exam', 'Policy authorizes…', 4),
(40105, NULL, 4, 12, 'final_exam', 'Inertia in this app…', 5);

-- Jumbled answers (correct letter rarely A)
DELETE FROM answers WHERE question_id BETWEEN 40001 AND 40105;
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(40001,'JS framework',0),(40001,'PHP web framework',1),(40001,'Database',0),(40001,'OS',0),
(40002,'Migrations only',0),(40002,'Web routes',1),(40002,'Blade cache',0),(40002,'Queue workers',0),
(40003,'Compile CSS',0),(40003,'Redis only',0),(40003,'Replace Eloquent',0),(40003,'Handle HTTP logic',1),
(40004,'Filter HTTP requests',1),(40004,'Render Blade only',0),(40004,'Delete models',0),(40004,'Run migrations',0),
(40005,'Middleware name',0),(40005,'Controller/action',1),(40005,'View path',0),(40005,'SQL query',0);

DELETE FROM answers WHERE question_id BETWEEN 40006 AND 40105;
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(40006,'Router',0),(40006,'Template only',0),(40006,'ORM for models',1),(40006,'Queue driver',0),
(40007,'public/css',0),(40007,'resources/views',1),(40007,'storage/logs',0),(40007,'routes/api',0),
(40008,'Delete form',0),(40008,'Skip validation',0),(40008,'CSRF token field',1),(40008,'JSON only',0),
(40009,'Cache config',0),(40009,'Version schema',1),(40009,'Compile assets',0),(40009,'Send mail',0),
(40010,'Clears .env',0),(40010,'Deletes public',0),(40010,'Stops server',0),(40010,'Runs migrations',1),
(40101,'Compiled routes',0),(40101,'Plain passwords',0),(40101,'Environment config',1),(40101,'Blade only',0),
(40102,'HTTP router only',0),(40102,'Dependency injection',1),(40102,'CSS bundler',0),(40102,'Mail only',0),
(40103,'Only @csrf',0),(40103,'Form Request / validate()',1),(40103,'No validation',0),(40103,'Git hooks',0),
(40104,'DB indexes',0),(40104,'User actions on models',1),(40104,'Queue names',0),(40104,'Vite config',0),
(40105,'MySQL feature',0),(40105,'Replaces PHP',0),(40105,'SPA pages with Vue/React',1),(40105,'Mail driver',0);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
