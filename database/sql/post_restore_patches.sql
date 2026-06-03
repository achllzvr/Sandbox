-- Apply after restoring sandbox_db from a phpMyAdmin dump.
-- Adds schema required by the refinement plan that may be missing from older backups.

-- Teacher registration document uploads (Phase 4)
ALTER TABLE `users`
    ADD COLUMN IF NOT EXISTS `id_front_url` varchar(500) DEFAULT NULL AFTER `institutional_credentials_url`,
    ADD COLUMN IF NOT EXISTS `id_back_url` varchar(500) DEFAULT NULL AFTER `id_front_url`,
    ADD COLUMN IF NOT EXISTS `authorization_letter_url` varchar(500) DEFAULT NULL AFTER `id_back_url`;

-- Assessment attempt history (Phase 1)
CREATE TABLE IF NOT EXISTS `module_quiz_attempts` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) UNSIGNED NOT NULL,
    `module_id` bigint(20) UNSIGNED NOT NULL,
    `attempt_number` int(10) UNSIGNED NOT NULL DEFAULT 1,
    `score` int(11) NOT NULL DEFAULT 0,
    `total` int(11) NOT NULL DEFAULT 0,
    `passed` tinyint(1) NOT NULL DEFAULT 0,
    `answers_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers_json`)),
    `completed_at` timestamp NULL DEFAULT current_timestamp(),
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `module_quiz_attempts_user_module_index` (`user_id`, `module_id`),
    KEY `module_quiz_attempts_module_id_foreign` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
