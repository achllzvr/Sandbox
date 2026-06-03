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

-- Student Review AI knowledge base (per certification)
CREATE TABLE IF NOT EXISTS `certification_knowledge_bases` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `certification_id` bigint unsigned NOT NULL,
    `summary` longtext DEFAULT NULL,
    `outline` json DEFAULT NULL,
    `content_hash` varchar(64) NOT NULL DEFAULT '',
    `status` enum('pending','ready','failed') NOT NULL DEFAULT 'pending',
    `error_message` text DEFAULT NULL,
    `generated_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `certification_knowledge_bases_certification_id_unique` (`certification_id`),
    KEY `certification_knowledge_bases_certification_id_foreign` (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Teacher voucher email delivery (group seat invites)
ALTER TABLE `vouchers`
    ADD COLUMN IF NOT EXISTS `recipient_email` varchar(255) DEFAULT NULL AFTER `used_by`,
    ADD COLUMN IF NOT EXISTS `sent_to_email_at` timestamp NULL DEFAULT NULL AFTER `expires_at`;
