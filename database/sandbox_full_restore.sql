-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 03, 2026 at 12:48 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sandbox_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `slug` varchar(64) NOT NULL,
  `label` varchar(150) NOT NULL,
  `icon` varchar(16) NOT NULL DEFAULT '⭐',
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `slug`, `label`, `icon`, `description`, `created_at`, `updated_at`) VALUES
(1, 'first_sandbox', 'First Sandbox', '🐚', 'Complete your first sandbox.', '2026-06-03 01:10:24', '2026-06-03 01:10:24'),
(2, 'seven_day_streak', '7-Day Streak', '🔥', 'Maintain a 7-day learning streak.', '2026-06-03 01:10:24', '2026-06-03 01:10:24'),
(3, 'quiz_ace', 'Quiz Ace', '⭐', 'Score 100% on a module quiz.', '2026-06-03 01:10:24', '2026-06-03 01:10:24'),
(4, 'cert_earned', 'Certified Hermit', '🏆', 'Earn a shell certificate.', '2026-06-03 01:10:24', '2026-06-03 01:10:24');

-- --------------------------------------------------------

--
-- Table structure for table `admin_invitations`
--

CREATE TABLE `admin_invitations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `answer_text` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`, `created_at`, `updated_at`) VALUES
(1, 10001, 'Payment receipt', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(2, 10001, 'Interactive learning module', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(3, 10001, 'Profile badge', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(4, 10001, 'Admin panel', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(5, 10002, 'Pay again', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(6, 10002, 'Skip to exam', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(7, 10002, 'Complete previous sandbox', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(8, 10002, 'Delete account', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(9, 10003, 'Castle only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10, 10003, 'Home icon', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(11, 10003, 'Logout', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(12, 10003, 'Shovel/quiz icon', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(17, 10005, 'App resets', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(18, 10005, 'Final exam unlocks', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(19, 10005, 'Lose sand dollars', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20, 10005, 'Nothing', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(21, 10006, 'Random color', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(22, 10006, 'Alphabetical', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(23, 10006, 'Cert ID theme key', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(24, 10006, 'Always pink', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(25, 10007, 'Gray modal', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(26, 10007, 'No popups', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(27, 10007, 'Black/yellow', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(28, 10007, 'Shell color + white CTA', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(33, 10009, 'One question', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(34, 10009, 'Five questions', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(35, 10009, 'Unlimited', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(36, 10009, 'Zero', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(37, 10010, 'Hidden', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(38, 10010, 'Deleted', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(39, 10010, 'Checkmark/done', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40, 10010, 'Shop item', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(41, 10011, 'Two', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(42, 10011, 'Ten', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(43, 10011, 'One', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(44, 10011, 'Four', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(49, 10013, 'Second Hermy', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(50, 10013, 'Sandcastle exam', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(51, 10013, 'Shop link', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(52, 10013, 'Blank', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(53, 10014, 'Admin dash', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(54, 10014, 'Profiles', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(55, 10014, 'That shell map', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(56, 10014, 'Nothing', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(57, 10015, '100%', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(58, 10015, '0%', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(59, 10015, '50%', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(60, 10015, '70%', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(61, 10101, 'Five', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(62, 10101, 'Ten', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(63, 10101, 'Two', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(64, 10101, 'None', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(65, 10102, 'REACT BASICS', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(66, 10102, 'JAVA BASICS', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(67, 10102, 'FULL DEMO', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(68, 10102, 'LARAVEL', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(69, 10103, 'Castle', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(70, 10103, 'Cart', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(71, 10103, 'Trophy', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(72, 10103, 'Shovel/quiz', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(77, 10105, 'Random shuffle', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(78, 10105, 'Unit dividers', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(79, 10105, 'New account', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(80, 10105, 'Receipts', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(81, 20001, 'SQL', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(82, 20001, 'Bytecode', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(83, 20001, 'Building UIs', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(84, 20001, 'Static files', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(85, 20002, 'SQL inline', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(86, 20002, 'PHP only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(87, 20002, 'Binary', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(88, 20002, 'HTML-like JS markup', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(93, 20004, 'Globals', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(94, 20004, 'Parent→child inputs', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(95, 20004, 'CSS only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(96, 20004, 'DB strings', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(97, 20005, 'Skip diff', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(98, 20005, 'Replace HTTP', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(99, 20005, 'Batch updates via diff', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(100, 20005, 'Hash passwords', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(101, 20006, 'Setter only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(102, 20006, 'DOM node', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(103, 20006, 'CSS class', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(104, 20006, 'Value + setter', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(109, 20008, 'Delete props', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(110, 20008, 'Shared state in ancestor', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(111, 20008, 'Disable hooks', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(112, 20008, 'Classes only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(113, 20009, 'Encrypt', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(114, 20009, 'Remove keys', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(115, 20009, 'Track identity', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(116, 20009, 'Sort A-Z', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(117, 20010, 'Disable hooks', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(118, 20010, 'Ship prod 2x', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(119, 20010, 'Block JSX', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(120, 20010, 'Double-invoke effects', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(121, 20101, 'Oracle', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(122, 20101, 'Microsoft', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(123, 20101, 'Meta', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(124, 20101, 'Apple', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(125, 20102, 'ReactDOM.render', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(126, 20102, 'jQuery', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(127, 20102, 'Vue', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(128, 20102, 'React 18 createRoot', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(133, 20104, 'div required', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(134, 20104, '<> or Fragment', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(135, 20104, 'section only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(136, 20104, 'No group', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(137, 20105, 'PHP routes', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(138, 20105, 'MySQL', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(139, 20105, 'Rendering/transitions', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(140, 20105, 'Email', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(141, 10004, 'Title banner only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(142, 10004, 'Shop only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(143, 10004, 'Never shown', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(144, 10004, 'Beside path on right', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(145, 10008, 'Any one sandbox', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(146, 10008, 'Pay twice', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(147, 10008, 'All sandboxes done', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(148, 10008, 'Admin only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(149, 10012, '1 and 2 only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(150, 10012, 'Sandboxes 3,7,10', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(151, 10012, 'Exam only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(152, 10012, 'None', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(153, 10104, 'Admin role', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(154, 10104, 'All shells free', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(155, 10104, 'Delete quizzes', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(156, 10104, 'Hermit certificate', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(157, 20003, 'Never functions', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(158, 20003, 'Server only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(159, 20003, 'Return UI output', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(160, 20003, 'No props', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(161, 20007, 'Every keystroke', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(162, 20007, 'After render commit', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(163, 20007, 'Unmount only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(164, 20007, 'Never in FC', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(165, 20103, 'Cookie only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(166, 20103, 'localStorage only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(167, 20103, 'Refs only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(168, 20103, 'State + onChange', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(169, 30001, 'Markup language', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(170, 30001, 'OS kernel', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(171, 30001, 'Object-oriented language', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(172, 30001, 'Browser', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(173, 30002, 'Java Visual Module', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(174, 30002, 'Joint Version Manager', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(175, 30002, 'Java Virtual Machine', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(176, 30002, 'JSON VM', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(177, 30003, 'Delete fields', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(178, 30003, 'No classes', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(179, 30003, 'Only static', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(180, 30003, 'Hide data + expose methods', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(181, 30004, 'Inheritance', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(182, 30004, 'Compilation', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(183, 30004, 'Garbage only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(184, 30004, 'Thread start', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(185, 30005, 'Interface always concrete', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(186, 30005, 'Interface defines contract', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(187, 30005, 'Class cannot implement', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(188, 30005, 'Same as enum', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(189, 30006, 'Hash table only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(190, 30006, 'Resizable array list', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(191, 30006, 'Stack only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(192, 30006, 'Tree map', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(193, 30007, 'Sorted set', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(194, 30007, 'Primitive stack', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(195, 30007, 'Key-value pairs', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(196, 30007, 'HTML nodes', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(197, 30008, 'Runtime only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(198, 30008, 'No types', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(199, 30008, 'Type safety at compile time', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(200, 30008, 'CSS', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(201, 30009, 'SQL queries', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(202, 30009, 'Sequential traversal', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(203, 30009, 'HTTP', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(204, 30009, 'File delete', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(205, 30010, 'List no order', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(206, 30010, 'Set indexed', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(207, 30010, 'Same thing', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(208, 30010, 'Set no duplicates', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(209, 30101, 'Private ctor only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(210, 30101, 'Entry point static void', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(211, 30101, 'Deprecated', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(212, 30101, 'Interface', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(213, 30102, 'Mutable global', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(214, 30102, 'Belongs to class not instance', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(215, 30102, 'Same as final', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(216, 30102, 'Thread lock', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(217, 30103, 'Must be public', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(218, 30103, 'Auto GC', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(219, 30103, 'Cannot reassign reference', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(220, 30103, 'Interface', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(221, 30104, 'Never thrown', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(222, 30104, 'Runtime only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(223, 30104, 'Must handle or declare', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(224, 30104, 'CSS error', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(225, 30105, 'Swing only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(226, 30105, 'SQL only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(227, 30105, 'HTTP server', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(228, 30105, 'Collections framework', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(229, 40001, 'JS framework', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(230, 40001, 'PHP web framework', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(231, 40001, 'Database', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(232, 40001, 'OS', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(233, 40002, 'Migrations only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(234, 40002, 'Web routes', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(235, 40002, 'Blade cache', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(236, 40002, 'Queue workers', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(237, 40003, 'Compile CSS', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(238, 40003, 'Redis only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(239, 40003, 'Replace Eloquent', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(240, 40003, 'Handle HTTP logic', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(241, 40004, 'Filter HTTP requests', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(242, 40004, 'Render Blade only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(243, 40004, 'Delete models', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(244, 40004, 'Run migrations', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(245, 40005, 'Middleware name', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(246, 40005, 'Controller/action', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(247, 40005, 'View path', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(248, 40005, 'SQL query', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(249, 40006, 'Router', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(250, 40006, 'Template only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(251, 40006, 'ORM for models', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(252, 40006, 'Queue driver', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(253, 40007, 'public/css', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(254, 40007, 'resources/views', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(255, 40007, 'storage/logs', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(256, 40007, 'routes/api', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(257, 40008, 'Delete form', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(258, 40008, 'Skip validation', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(259, 40008, 'CSRF token field', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(260, 40008, 'JSON only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(261, 40009, 'Cache config', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(262, 40009, 'Version schema', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(263, 40009, 'Compile assets', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(264, 40009, 'Send mail', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(265, 40010, 'Clears .env', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(266, 40010, 'Deletes public', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(267, 40010, 'Stops server', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(268, 40010, 'Runs migrations', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(269, 40101, 'Compiled routes', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(270, 40101, 'Plain passwords', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(271, 40101, 'Environment config', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(272, 40101, 'Blade only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(273, 40102, 'HTTP router only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(274, 40102, 'Dependency injection', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(275, 40102, 'CSS bundler', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(276, 40102, 'Mail only', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(277, 40103, 'Only @csrf', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(278, 40103, 'Form Request / validate()', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(279, 40103, 'No validation', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(280, 40103, 'Git hooks', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(281, 40104, 'DB indexes', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(282, 40104, 'User actions on models', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(283, 40104, 'Queue names', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(284, 40104, 'Vite config', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(285, 40105, 'MySQL feature', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(286, 40105, 'Replaces PHP', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(287, 40105, 'SPA pages with Vue/React', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(288, 40105, 'Mail driver', 0, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(289, 40106, 'Programming Language', 1, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(290, 40106, 'Coffee', 0, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(291, 40106, 'Cafe', 0, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(292, 40106, 'Food', 0, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(293, 40109, 'Yes', 1, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(294, 40109, 'No', 0, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(295, 40109, 'Maybe', 0, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(296, 40109, 'Idk', 0, '2026-06-03 02:17:33', '2026-06-03 02:17:33'),
(297, 40111, 'Programming Language', 1, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(298, 40111, 'Coffee', 0, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(299, 40111, 'Cafe', 0, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(300, 40111, 'Food', 0, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(301, 40114, 'Yes', 1, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(302, 40114, 'No', 0, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(303, 40114, 'Maybe', 0, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(304, 40114, 'Idk', 0, '2026-06-03 02:17:51', '2026-06-03 02:17:51');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `details` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `details`, `created_at`, `updated_at`) VALUES
(1, 3, 'teacher_approved', '{\"teacher_id\":15,\"teacher_email\":\"slickmails29@gmail.com\",\"affiliation\":\"NU Lipa\"}', '2026-06-03 01:16:17', '2026-06-03 01:16:17');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `exam_attempt_id` bigint(20) UNSIGNED NOT NULL,
  `certificate_code` varchar(100) NOT NULL,
  `status` enum('valid','revoked') NOT NULL DEFAULT 'valid',
  `issued_at` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `estimated_duration` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `accent_color` varchar(7) DEFAULT NULL,
  `learning_objectives` text DEFAULT NULL,
  `prerequisites` text DEFAULT NULL,
  `tags` longtext DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `pass_threshold` int(11) NOT NULL DEFAULT 75,
  `status` enum('draft','pending_approval','pending_review','revision_required','approved','published','declined','denied') NOT NULL DEFAULT 'draft',
  `remarks` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_by_user_id` bigint(20) UNSIGNED NOT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `decline_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `title`, `description`, `category`, `difficulty`, `estimated_duration`, `thumbnail`, `accent_color`, `learning_objectives`, `prerequisites`, `tags`, `price`, `pass_threshold`, `status`, `remarks`, `submitted_at`, `created_by_user_id`, `approved_by`, `approved_at`, `decline_reason`, `created_at`, `updated_at`) VALUES
(1, 'FULL DEMO', '10 sandboxes, 4 units, quizzes on #3/#7/#10, final exam.', 'Demo', 'Beginner', '2 hours', 'shell-covers/full-demo.jpg', '#f08070', 'Full student journey.', 'None', '[\"demo\"]', 0.00, 70, 'published', NULL, '2026-06-03 09:10:18', 12, 3, '2026-06-03 09:10:18', NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(2, 'REACT BASICS', '10 sandboxes, 4 units, quizzes on #3/#5, final exam.', 'Technology', 'Beginner', '4 hours', 'shell-covers/react-basics.jpg', '#60b0f0', 'Build UI with React.', 'HTML & JS', '[\"react\"]', 0.00, 75, 'published', NULL, '2026-06-03 09:10:18', 12, 3, '2026-06-03 09:10:18', NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(3, 'JAVA BASICS', '10 sandboxes, 4 units, quizzes on #3/#5, final exam.', 'Technology', 'Intermediate', '6 hours', 'shell-covers/java-basics.jpg', '#f07060', 'Core Java skills.', 'Programming logic', '[\"java\"]', 499.00, 75, 'published', NULL, '2026-06-03 09:10:18', 12, 3, '2026-06-03 09:10:18', NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(4, 'LARAVEL BASICS', '10 sandboxes, 4 units, quizzes on #3/#5, final exam.', 'Technology', 'Intermediate', '5 hours', 'shell-covers/laravel-basics.jpg', '#f02020', 'Laravel MVC.', 'PHP basics', '[\"laravel\"]', 799.00, 75, 'published', NULL, '2026-06-03 09:10:18', 12, 3, '2026-06-03 09:10:18', NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(5, 'Java Basics', 'Certification course for the proficiency in the basics of using Java.', 'Technology', 'Beginner', '120 hours', 'certification-covers/TD7118BEOPjPM1Sfhg08GVJevfGOwGx71TrWcr96.png', '#e02020', 'How to use Java', NULL, '[]', 299.00, 75, 'draft', NULL, NULL, 12, NULL, NULL, NULL, '2026-06-03 01:23:30', '2026-06-03 01:46:13');

-- --------------------------------------------------------

--
-- Table structure for table `cohorts`
--

CREATE TABLE `cohorts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `teacher_id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cohort_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cohorts`
--

INSERT INTO `cohorts` (`id`, `teacher_id`, `certification_id`, `cohort_name`, `created_at`, `updated_at`) VALUES
(1, 15, 2, 'Batch Jun 3, 2026', '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(2, 15, 3, 'Batch Jun 3, 2026', '2026-06-03 01:19:10', '2026-06-03 01:19:10');

-- --------------------------------------------------------

--
-- Table structure for table `cohort_students`
--

CREATE TABLE `cohort_students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cohort_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `voucher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cosmetic_items`
--

CREATE TABLE `cosmetic_items` (
  `id` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` enum('hat','shell','background','accessory') NOT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `creator_earnings`
--

CREATE TABLE `creator_earnings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `creator_id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `payment_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','available','withdrawn','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `daily_quests`
--

CREATE TABLE `daily_quests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `slug` varchar(64) NOT NULL,
  `label` varchar(200) NOT NULL,
  `event_type` varchar(64) NOT NULL,
  `target` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `reward_sd` int(10) UNSIGNED NOT NULL DEFAULT 10,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `otp` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `resend_count` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `voucher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `access_type` enum('direct_purchase','voucher','admin_grant') NOT NULL DEFAULT 'direct_purchase',
  `status` enum('active','completed','revoked') NOT NULL DEFAULT 'active',
  `enrolled_at` timestamp NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `certification_id`, `enrollment_request_id`, `voucher_id`, `access_type`, `status`, `enrolled_at`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 9, 1, NULL, NULL, 'admin_grant', 'active', '2026-06-03 09:10:18', NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(2, 13, 2, NULL, NULL, 'admin_grant', 'active', '2026-06-03 09:10:18', NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_requests`
--

CREATE TABLE `enrollment_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `request_type` enum('direct_purchase','teacher_bulk') NOT NULL DEFAULT 'direct_purchase',
  `quantity` int(11) NOT NULL DEFAULT 1,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','paid','approved','rejected','failed','cancelled') NOT NULL DEFAULT 'pending',
  `payment_proof_url` varchar(500) DEFAULT NULL,
  `payment_reference` varchar(255) DEFAULT NULL,
  `xendit_invoice_id` varchar(255) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `requested_at` timestamp NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollment_requests`
--

INSERT INTO `enrollment_requests` (`id`, `user_id`, `certification_id`, `request_type`, `quantity`, `amount`, `status`, `payment_proof_url`, `payment_reference`, `xendit_invoice_id`, `payment_method`, `requested_at`, `reviewed_at`, `reviewed_by`, `created_at`, `updated_at`) VALUES
(1, 15, 2, 'teacher_bulk', 5, 0.00, 'paid', NULL, 'SBX-TCH-4YHHEFKSLQAT', 'free-SBX-TCH-4YHHEFKSLQAT', 'FREE_BATCH', '2026-06-03 01:16:38', '2026-06-03 01:16:38', NULL, '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(2, 15, 3, 'teacher_bulk', 5, 2495.00, 'pending', NULL, 'SBX-TCH-0AWGDY1EQ5NS', '6a1ff15b5a94e76df9c45e27', NULL, '2026-06-03 01:18:19', NULL, NULL, '2026-06-03 01:18:19', '2026-06-03 01:18:20'),
(3, 15, 3, 'teacher_bulk', 5, 2495.00, 'paid', NULL, 'SBX-TCH-XOYVUUF9Z6EU', '6a1ff180e1a14a7a10068542', 'EWALLET', '2026-06-03 01:18:56', '2026-06-03 01:19:10', NULL, '2026-06-03 01:18:56', '2026-06-03 01:19:10');

-- --------------------------------------------------------

--
-- Table structure for table `equipped_cosmetics`
--

CREATE TABLE `equipped_cosmetics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `equipped_hat` varchar(100) DEFAULT NULL,
  `equipped_shell` varchar(100) DEFAULT NULL,
  `equipped_background` varchar(100) DEFAULT NULL,
  `equipped_accessory` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_attempts`
--

CREATE TABLE `exam_attempts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `total_questions` int(11) NOT NULL DEFAULT 0,
  `passed` tinyint(1) NOT NULL DEFAULT 0,
  `attempted_at` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_attempt_answers`
--

CREATE TABLE `exam_attempt_answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `attempt_id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `selected_answer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gamification_events`
--

CREATE TABLE `gamification_events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_type` varchar(64) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `source_type` varchar(64) DEFAULT NULL,
  `source_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `learning_materials`
--

CREATE TABLE `learning_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('ppt','document','youtube_video') NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `youtube_embed_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `order_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `created_by_user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `certification_id`, `created_by_user_id`, `title`, `description`, `order_index`, `created_at`, `updated_at`) VALUES
(11, 1, 12, 'UNIT 1 — FOUNDATIONS', 'Start here.', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(12, 1, 12, 'UNIT 2 — CORE SKILLS', 'Core skills.', 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(13, 1, 12, 'UNIT 3 — ADVANCED TOPICS', 'Go deeper.', 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(14, 1, 12, 'UNIT 4 — CHECKPOINT', 'Review.', 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(21, 2, 12, 'UNIT 1 — REACT FUNDAMENTALS', 'Components.', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(22, 2, 12, 'UNIT 2 — STATE & HOOKS', 'Hooks.', 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(23, 2, 12, 'UNIT 3 — REACT PATTERNS', 'Patterns and performance.', 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(24, 2, 12, 'UNIT 4 — REACT CAPSTONE', 'Capstone review.', 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(31, 3, 12, 'UNIT 1 — JAVA CORE', 'OOP.', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(32, 3, 12, 'UNIT 2 — COLLECTIONS', 'Collections.', 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(33, 3, 12, 'UNIT 3 — JAVA ADVANCED', 'Advanced Java.', 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(34, 3, 12, 'UNIT 4 — JAVA CAPSTONE', 'Capstone review.', 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(41, 4, 12, 'UNIT 1 — LARAVEL MVC', 'MVC.', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(42, 4, 12, 'UNIT 2 — ELOQUENT & BLADE', 'DB & views.', 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(43, 4, 12, 'UNIT 3 — LARAVEL ADVANCED', 'Advanced Laravel.', 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(44, 4, 12, 'UNIT 4 — LARAVEL CAPSTONE', 'Capstone review.', 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(45, 5, 12, 'Course Modules', 'Default lesson containing all modules', 1, '2026-06-03 01:23:30', '2026-06-03 01:23:30');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `uploaded_by_user_id` bigint(20) UNSIGNED NOT NULL,
  `uploaded_by_content_creator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `strict_completion` tinyint(1) NOT NULL DEFAULT 0,
  `order_index` int(11) NOT NULL DEFAULT 1,
  `sequence` int(11) NOT NULL DEFAULT 1,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `lesson_id`, `uploaded_by_user_id`, `uploaded_by_content_creator_id`, `title`, `description`, `strict_completion`, `order_index`, `sequence`, `start_date`, `end_date`, `duration_days`, `created_at`, `updated_at`) VALUES
(101, 11, 12, 12, 'Welcome to the Sandbox', NULL, 0, 1, 1, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(102, 11, 12, 12, 'Your First Shell', NULL, 0, 2, 2, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(103, 11, 12, 12, 'Foundations Quiz', NULL, 0, 3, 3, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(104, 12, 12, 12, 'Building Blocks', NULL, 0, 1, 4, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(105, 12, 12, 12, 'Practice Drill', NULL, 0, 2, 5, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(106, 12, 12, 12, 'Skill Check', NULL, 0, 3, 6, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(107, 13, 12, 12, 'Advanced Quiz', NULL, 0, 1, 7, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(108, 13, 12, 12, 'Deep Dive', NULL, 0, 2, 8, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(109, 13, 12, 12, 'Applied Concepts', NULL, 0, 3, 9, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(110, 14, 12, 12, 'Unit Review Quiz', NULL, 0, 1, 10, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(201, 21, 12, 12, 'What is React?', NULL, 0, 1, 1, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(202, 21, 12, 12, 'Components & JSX', NULL, 0, 2, 2, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(203, 21, 12, 12, 'React Checkpoint Quiz', NULL, 0, 3, 3, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(204, 22, 12, 12, 'State & Hooks', NULL, 0, 1, 4, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(205, 22, 12, 12, 'Hooks Quiz', NULL, 0, 2, 5, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(206, 23, 12, 12, 'Context API', NULL, 0, 1, 6, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(207, 23, 12, 12, 'Performance Tips', NULL, 0, 2, 7, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(208, 23, 12, 12, 'Testing Basics', NULL, 0, 3, 8, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(209, 24, 12, 12, 'Project Workshop', NULL, 0, 1, 9, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(210, 24, 12, 12, 'React Capstone Review', NULL, 0, 2, 10, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(301, 31, 12, 12, 'Java & the JVM', NULL, 0, 1, 1, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(302, 31, 12, 12, 'OOP in Java', NULL, 0, 2, 2, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(303, 31, 12, 12, 'Java OOP Quiz', NULL, 0, 3, 3, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(304, 32, 12, 12, 'Collections Framework', NULL, 0, 1, 4, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(305, 32, 12, 12, 'Collections Quiz', NULL, 0, 2, 5, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(306, 33, 12, 12, 'Generics & Streams', NULL, 0, 1, 6, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(307, 33, 12, 12, 'Exception Handling', NULL, 0, 2, 7, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(308, 33, 12, 12, 'File I/O', NULL, 0, 3, 8, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(309, 34, 12, 12, 'Java Workshop', NULL, 0, 1, 9, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(310, 34, 12, 12, 'Java Capstone Review', NULL, 0, 2, 10, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(401, 41, 12, 12, 'Laravel Overview', NULL, 0, 1, 1, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(402, 41, 12, 12, 'Routing & Controllers', NULL, 0, 2, 2, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(403, 41, 12, 12, 'Routing Quiz', NULL, 0, 3, 3, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(404, 42, 12, 12, 'Eloquent ORM', NULL, 0, 1, 4, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(405, 42, 12, 12, 'Blade & Views Quiz', NULL, 0, 2, 5, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(406, 43, 12, 12, 'Middleware & Requests', NULL, 0, 1, 6, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(407, 43, 12, 12, 'Validation & Policies', NULL, 0, 2, 7, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(408, 43, 12, 12, 'Queues & Jobs', NULL, 0, 3, 8, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(409, 44, 12, 12, 'Laravel Workshop', NULL, 0, 1, 9, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(410, 44, 12, 12, 'Laravel Capstone Review', NULL, 0, 2, 10, NULL, NULL, NULL, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(411, 45, 12, 12, 'Introduction', 'Basics', 0, 1, 1, NULL, NULL, NULL, '2026-06-03 01:24:05', '2026-06-03 01:50:01'),
(412, 45, 12, 12, 'Variables & Data Types', 'About Variables & Data Types', 1, 1, 2, NULL, NULL, NULL, '2026-06-03 01:24:15', '2026-06-03 01:52:22'),
(413, 45, 12, 12, 'Booleans, If, Else', 'Booleans, If, Else', 0, 1, 3, NULL, NULL, NULL, '2026-06-03 01:24:28', '2026-06-03 02:07:16'),
(414, 45, 12, 12, 'Quiz Checkup', 'Quiz Checkup', 1, 1, 4, NULL, NULL, NULL, '2026-06-03 01:25:04', '2026-06-03 02:17:57'),
(415, 45, 12, 12, 'Exception Handling', NULL, 1, 1, 5, NULL, NULL, NULL, '2026-06-03 01:25:15', '2026-06-03 02:21:11'),
(416, 45, 12, 12, 'Exception Handling', 'Exception Handling', 1, 1, 6, NULL, NULL, NULL, '2026-06-03 01:25:26', '2026-06-03 02:25:23'),
(417, 45, 12, 12, 'Intro to I/O Streams', NULL, 1, 1, 7, NULL, NULL, NULL, '2026-06-03 01:25:34', '2026-06-03 02:29:28'),
(418, 45, 12, 12, 'File I/O Streams', NULL, 1, 1, 8, NULL, NULL, NULL, '2026-06-03 01:25:51', '2026-06-03 02:33:50'),
(419, 45, 12, 12, 'Buffered Streams and Advanced I/O', NULL, 1, 1, 9, NULL, NULL, NULL, '2026-06-03 01:26:51', '2026-06-03 02:35:42'),
(420, 45, 12, 12, 'Reading and Writing Files', NULL, 1, 1, 10, NULL, NULL, NULL, '2026-06-03 01:27:07', '2026-06-03 02:42:11'),
(421, 45, 12, 12, 'Advanced File Handling', NULL, 1, 1, 11, NULL, NULL, NULL, '2026-06-03 02:42:22', '2026-06-03 02:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `module_content`
--

CREATE TABLE `module_content` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `uploaded_by_user_id` bigint(20) UNSIGNED NOT NULL,
  `content_type` enum('video','presentation','document','youtube_embed','other') NOT NULL,
  `title` varchar(150) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `module_content`
--

INSERT INTO `module_content` (`id`, `module_id`, `uploaded_by_user_id`, `content_type`, `title`, `file_url`, `order_index`, `created_at`, `updated_at`) VALUES
(1, 101, 12, 'youtube_embed', 'Welcome', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(2, 102, 12, 'youtube_embed', 'Walkthrough', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(3, 104, 12, 'youtube_embed', 'Building blocks', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(4, 105, 12, 'youtube_embed', 'Practice', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(5, 106, 12, 'youtube_embed', 'Skill check', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(6, 108, 12, 'youtube_embed', 'Deep dive', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(7, 109, 12, 'youtube_embed', 'Applied', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(8, 110, 12, 'youtube_embed', 'Review intro', 'https://www.youtube.com/embed/EngW7tLk6R8', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(9, 201, 12, 'youtube_embed', 'React intro', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10, 202, 12, 'youtube_embed', 'Components', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(11, 204, 12, 'youtube_embed', 'Hooks', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(12, 301, 12, 'youtube_embed', 'Java intro', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(13, 302, 12, 'youtube_embed', 'OOP', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(14, 304, 12, 'youtube_embed', 'Collections', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(15, 401, 12, 'youtube_embed', 'Laravel intro', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(16, 402, 12, 'youtube_embed', 'Routing', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(17, 404, 12, 'youtube_embed', 'Eloquent', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(18, 206, 12, 'youtube_embed', 'Context API', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(19, 207, 12, 'youtube_embed', 'Performance', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20, 208, 12, 'youtube_embed', 'Testing', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(21, 209, 12, 'youtube_embed', 'Workshop', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(22, 210, 12, 'youtube_embed', 'Capstone', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(23, 306, 12, 'youtube_embed', 'Generics', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(24, 307, 12, 'youtube_embed', 'Exceptions', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(25, 308, 12, 'youtube_embed', 'File I/O', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(26, 309, 12, 'youtube_embed', 'Workshop', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(27, 310, 12, 'youtube_embed', 'Capstone', 'https://www.youtube.com/embed/eIrMbAQSU34', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(28, 406, 12, 'youtube_embed', 'Middleware', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(29, 407, 12, 'youtube_embed', 'Validation', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30, 408, 12, 'youtube_embed', 'Queues', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(31, 409, 12, 'youtube_embed', 'Workshop', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(32, 410, 12, 'youtube_embed', 'Capstone', 'https://www.youtube.com/embed/Imx223jqqEE', 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(35, 411, 12, 'presentation', 'Introduction', 'module-contents/mBawVAzuFfoqXp9AIivEfTwc0jrxFv0zLU8nXlU7.pdf', 1, '2026-06-03 01:47:23', '2026-06-03 01:47:23'),
(36, 411, 12, 'document', 'Introduction', 'module-contents/DyYjR2ugtxAo0P4HghFVR5YCoJjEWByKX1Ym4YfL.pdf', 2, '2026-06-03 01:48:15', '2026-06-03 01:48:15'),
(37, 411, 12, 'youtube_embed', 'Introduction', 'https://www.youtube.com/embed/t54pgbVy6t0', 3, '2026-06-03 01:48:52', '2026-06-03 01:48:52'),
(38, 412, 12, 'presentation', 'Variables & Data Types', 'module-contents/QcQSmXNuMY4KabwhE69Y4BRkolRKAZQwwB0BOhTK.bin', 1, '2026-06-03 01:50:25', '2026-06-03 01:50:25'),
(39, 412, 12, 'document', 'Variables & Data Types', 'module-contents/s0nWX3RcLsy4h8g0Fa0dVWLgeC6kRaUzankGVMaR.pdf', 2, '2026-06-03 01:50:38', '2026-06-03 01:50:38'),
(41, 412, 12, 'youtube_embed', 'Data Types', 'https://www.youtube.com/embed/D3DqJrlckbs', 4, '2026-06-03 01:51:09', '2026-06-03 01:51:09'),
(42, 412, 12, 'youtube_embed', 'Variables', 'https://www.youtube.com/embed/YF59k3gZeb4', 4, '2026-06-03 01:51:28', '2026-06-03 01:51:28'),
(43, 413, 12, 'presentation', 'Booleans, If, Else', 'module-contents/nUocXEG4prOeVYPtRXNMEVYEixSyMVM3A2uRJb2g.bin', 1, '2026-06-03 01:52:46', '2026-06-03 01:52:46'),
(44, 413, 12, 'document', 'Boolean, If, Else', 'module-contents/2jF6TuIMufGuvc6BGRETLHE9sKczWwlPWe253or5.pdf', 2, '2026-06-03 02:06:29', '2026-06-03 02:06:29'),
(45, 413, 12, 'youtube_embed', 'Boolean', 'https://www.youtube.com/embed/aQ_LE97OMvU', 3, '2026-06-03 02:06:57', '2026-06-03 02:06:57'),
(46, 413, 12, 'youtube_embed', 'If Else', 'https://www.youtube.com/embed/J50PRNQGMJU', 4, '2026-06-03 02:07:15', '2026-06-03 02:07:15'),
(47, 415, 12, 'presentation', 'Exception Handling Basics', 'module-contents/X0bl1pDKDSZvhc0ZQ3ic9m26q6eSOdwco5Gyp86A.bin', 1, '2026-06-03 02:18:31', '2026-06-03 02:18:31'),
(48, 415, 12, 'document', 'Exception Handling Basics', 'module-contents/JfZ9ir850EbsklwZZOeYOBNn51MHz0dOuAcEoBIg.pdf', 2, '2026-06-03 02:18:43', '2026-06-03 02:18:43'),
(49, 415, 12, 'youtube_embed', 'Exception Handling', 'https://www.youtube.com/embed/Ek08P2WddCs', 3, '2026-06-03 02:21:00', '2026-06-03 02:21:00'),
(50, 416, 12, 'presentation', 'Exception Handling', 'module-contents/T0S3XVRixE2kmvXLSdzgsMclxbcGrU98DhTheTpr.bin', 1, '2026-06-03 02:25:20', '2026-06-03 02:25:20'),
(51, 416, 12, 'document', 'Exception Handling', 'module-contents/KY9EPLEZ4zoccC3VYDOiOdQbXRkK9cQKktUDULAg.pdf', 2, '2026-06-03 02:25:35', '2026-06-03 02:25:35'),
(52, 416, 12, 'youtube_embed', 'Exception Handling', 'https://www.youtube.com/embed/Ek08P2WddCs', 3, '2026-06-03 02:25:48', '2026-06-03 02:25:48'),
(53, 417, 12, 'presentation', 'Intro to I/O Streams', 'module-contents/V5kEFfg7TjAjRZZRqUN0AvJaKac7Zq4YHAg99pOb.bin', 1, '2026-06-03 02:28:44', '2026-06-03 02:28:44'),
(54, 417, 12, 'document', 'Intro to I/O Streams', 'module-contents/JJxYL6SVCX6Teh5reosFVmswhUYMJ64AIINWD0hc.pdf', 2, '2026-06-03 02:28:55', '2026-06-03 02:28:55'),
(55, 417, 12, 'youtube_embed', 'Intro to I/O Streams', 'https://www.youtube.com/embed/dVANhb1LuVw', 3, '2026-06-03 02:29:21', '2026-06-03 02:29:21'),
(56, 418, 12, 'presentation', 'File I/O Streams', 'module-contents/t5h7OkVb8Yn4IQTckCyB6qzl2SKXN2ofwEneHvdF.bin', 1, '2026-06-03 02:33:32', '2026-06-03 02:33:32'),
(57, 418, 12, 'document', 'File I/O Streams', 'module-contents/vNDAVRNcdGwpcRqFvZFE9Krw5JrenScno3c4KbVS.pdf', 2, '2026-06-03 02:33:42', '2026-06-03 02:33:42'),
(58, 418, 12, 'youtube_embed', 'File I/O Streams', 'https://www.youtube.com/embed/e3dFoA4-tqs', 3, '2026-06-03 02:34:14', '2026-06-03 02:34:14'),
(59, 419, 12, 'presentation', 'Buffered Streams and Advanced I/O', 'module-contents/vBIVA4OOETzYiH7lFjHVedUMXqCpiFdPeBCelYdO.bin', 1, '2026-06-03 02:35:13', '2026-06-03 02:35:13'),
(60, 419, 12, 'document', 'Buffered Streams and Advanced I/O', 'module-contents/FMyU4NF80Luf4mnR0OYTZWI96SM2yf98mrRSWr6c.pdf', 2, '2026-06-03 02:35:23', '2026-06-03 02:35:23'),
(61, 419, 12, 'youtube_embed', 'Buffered Streams and Advanced I/O', 'https://www.youtube.com/embed/eob6h5ypGqg', 3, '2026-06-03 02:35:41', '2026-06-03 02:35:41'),
(62, 420, 12, 'presentation', 'Reading and Writing Files', 'module-contents/0zV58EFA5L8yozCqHhj1UhPLWEuCKWRZYuUVzhx5.bin', 1, '2026-06-03 02:41:39', '2026-06-03 02:41:39'),
(63, 420, 12, 'document', 'Reading and Writing Files', 'module-contents/S1ZjgDqz95s7athBzMac3OmUgeQkKkZTMdPC6K07.pdf', 2, '2026-06-03 02:41:49', '2026-06-03 02:41:49'),
(64, 420, 12, 'youtube_embed', 'Reading and Writing Files', 'https://www.youtube.com/embed/ScUJx4aWRi0', 3, '2026-06-03 02:42:09', '2026-06-03 02:42:09'),
(65, 421, 12, 'presentation', 'Advanced File Handling', 'module-contents/0MUCxuxoILqdo23TMAygdNwpDwbOMdLPebkYsamb.bin', 1, '2026-06-03 02:42:38', '2026-06-03 02:42:38'),
(66, 421, 12, 'document', 'Advanced File Handling', 'module-contents/xPmSYuMKCV9YO28nC3blH50xubelIuxL11UBIJhh.pdf', 2, '2026-06-03 02:42:53', '2026-06-03 02:42:53'),
(67, 421, 12, 'youtube_embed', 'Advanced File Handling', 'https://www.youtube.com/embed/ScUJx4aWRi0', 3, '2026-06-03 02:43:09', '2026-06-03 02:43:09');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_request_id` bigint(20) UNSIGNED NOT NULL,
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `provider` varchar(50) NOT NULL DEFAULT 'xendit',
  `provider_invoice_id` varchar(255) DEFAULT NULL,
  `provider_reference` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','failed','expired','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `method` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `raw_payload` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `enrollment_request_id`, `processed_by`, `provider`, `provider_invoice_id`, `provider_reference`, `amount`, `status`, `method`, `paid_at`, `raw_payload`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'xendit', 'free-SBX-TCH-4YHHEFKSLQAT', NULL, 0.00, 'paid', 'FREE_BATCH', '2026-06-03 01:16:38', '{\"id\":\"free-SBX-TCH-4YHHEFKSLQAT\",\"external_id\":\"SBX-TCH-4YHHEFKSLQAT\",\"status\":\"PAID\",\"amount\":0,\"payment_method\":\"FREE_BATCH\"}', '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(2, 3, NULL, 'xendit', '6a1ff180e1a14a7a10068542', 'ewc_75efb910-7b8a-4c43-babe-13659183c93e', 2495.00, 'paid', 'EWALLET', '2026-06-03 01:19:10', '{\"id\":\"6a1ff180e1a14a7a10068542\",\"external_id\":\"SBX-TCH-XOYVUUF9Z6EU\",\"user_id\":\"6a16fb0a33164ec57981a6c0\",\"payment_method\":\"EWALLET\",\"status\":\"PAID\",\"merchant_name\":\"Sandbox\",\"merchant_profile_picture_url\":\"https:\\/\\/du8nwjtfkinx.cloudfront.net\\/xendit.png\",\"amount\":2495,\"paid_amount\":2495,\"paid_at\":\"2026-06-03T09:19:02.532Z\",\"payer_email\":\"slickmails29@gmail.com\",\"description\":\"Bulk Certification Vouchers: JAVA BASICS\",\"expiry_date\":\"2026-06-04T09:18:56.627Z\",\"invoice_url\":\"https:\\/\\/checkout-staging.xendit.co\\/web\\/6a1ff180e1a14a7a10068542\",\"available_banks\":[],\"available_retail_outlets\":[{\"retail_outlet_name\":\"7ELEVEN\"},{\"retail_outlet_name\":\"CEBUANA\"},{\"retail_outlet_name\":\"DP_MLHUILLIER\"},{\"retail_outlet_name\":\"DP_ECPAY_LOAN\"},{\"retail_outlet_name\":\"DP_PALAWAN\"},{\"retail_outlet_name\":\"LBC\"},{\"retail_outlet_name\":\"DP_ECPAY_SCHOOL\"}],\"available_ewallets\":[{\"ewallet_type\":\"SHOPEEPAY\"},{\"ewallet_type\":\"GCASH\"},{\"ewallet_type\":\"GRABPAY\"},{\"ewallet_type\":\"PAYMAYA\"}],\"available_qr_codes\":[{\"qr_code_type\":\"QRPH\"}],\"available_direct_debits\":[{\"direct_debit_type\":\"DD_CHINABANK\"},{\"direct_debit_type\":\"DD_BPI\"},{\"direct_debit_type\":\"DD_RCBC\"},{\"direct_debit_type\":\"DD_BDO_EPAY\"},{\"direct_debit_type\":\"DD_UBP\"},{\"direct_debit_type\":\"DD_BDO_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_BPI_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_BOC_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_CHINABANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_INSTAPAY_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_LANDBANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_MAYBANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_METROBANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_PESONET_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_PNB_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_PSBANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_ROBINSONS_BANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_RCBC_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_SECURITY_BANK_ONLINE_BANKING\"},{\"direct_debit_type\":\"DD_UNIONBANK_ONLINE_BANKING\"}],\"available_paylaters\":[{\"paylater_type\":\"BILLEASE\"},{\"paylater_type\":\"CASHALO\"}],\"should_exclude_credit_card\":false,\"should_send_email\":false,\"success_redirect_url\":\"http:\\/\\/127.0.0.1:8000\\/teacher\\/shop?payment_reference=SBX-TCH-XOYVUUF9Z6EU\",\"failure_redirect_url\":\"http:\\/\\/127.0.0.1:8000\\/teacher\\/shop\",\"created\":\"2026-06-03T09:18:56.754Z\",\"updated\":\"2026-06-03T09:19:04.585Z\",\"currency\":\"PHP\",\"payment_channel\":\"GCASH\",\"payment_id\":\"ewc_75efb910-7b8a-4c43-babe-13659183c93e\",\"payment_method_id\":\"pm-0e2fa265-c50c-4f1f-a476-c233e993e3eb\",\"metadata\":null}', '2026-06-03 01:19:10', '2026-06-03 01:19:10');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `module_id` bigint(20) UNSIGNED DEFAULT NULL,
  `certification_id` bigint(20) UNSIGNED DEFAULT NULL,
  `learning_material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_type` enum('diagnostic','module_quiz','final_exam','fast_track') NOT NULL DEFAULT 'module_quiz',
  `interaction_type` varchar(32) NOT NULL DEFAULT 'multiple_choice',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `question_text` text NOT NULL,
  `points` int(11) NOT NULL DEFAULT 1,
  `order_index` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `module_id`, `certification_id`, `learning_material_id`, `created_by_user_id`, `question_type`, `interaction_type`, `metadata`, `question_text`, `points`, `order_index`, `created_at`, `updated_at`) VALUES
(10001, 103, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'What is a sandbox in this app?', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10002, 103, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'How do you unlock the next sandbox?', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10003, 103, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'What icon marks a quiz-only sandbox?', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10004, 103, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Where does Hermy appear on the map?', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10005, 103, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'What unlocks after all sandboxes are done?', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10006, 107, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Shell theme colors use…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10007, 107, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Sandbox popups use…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10008, 107, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Final exam unlock requires…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10009, 107, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Each module quiz has at most…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10010, 107, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Completed sandboxes show as…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10011, 110, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'How many units in FULL DEMO?', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10012, 110, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Quiz-only sandboxes are…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10013, 110, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Bottom of the map has…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10014, 110, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Enrollment gives access to…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10015, 110, 1, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'FULL DEMO pass threshold is…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10101, NULL, 1, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Sandboxes in FULL DEMO?', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10102, NULL, 1, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'This shell title is…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10103, NULL, 1, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Quiz sandboxes use icon…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10104, NULL, 1, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Passing final exam awards…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(10105, NULL, 1, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Units separated by…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20001, 203, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'React is for…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20002, 203, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'JSX is…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20003, 203, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Components must…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20004, 203, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Props are…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20005, 203, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Virtual DOM…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20006, 205, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'useState returns…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20007, 205, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'useEffect runs…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20008, 205, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Lifting state up…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20009, 205, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'List keys…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20010, 205, 2, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Strict Mode…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20101, NULL, 2, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'React maintained by…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20102, NULL, 2, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'createRoot is…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20103, NULL, 2, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Controlled input uses…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20104, NULL, 2, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Fragment is…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(20105, NULL, 2, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'React 18 improves…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30001, 303, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Java is…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30002, 303, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'JVM stands for…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30003, 303, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Encapsulation means…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30004, 303, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'extends keyword…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30005, 303, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Interface vs class…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30006, 305, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'ArrayList is…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30007, 305, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'HashMap stores…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30008, 305, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Generics provide…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30009, 305, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Iterator allows…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30010, 305, 3, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Set vs List…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30101, NULL, 3, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'main method is…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30102, NULL, 3, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'static means…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30103, NULL, 3, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'final variable…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30104, NULL, 3, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Checked exception…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(30105, NULL, 3, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Package java.util has…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40001, 403, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Laravel is a…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40002, 403, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'routes/web.php defines…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40003, 403, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Controller job…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40004, 403, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Middleware…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40005, 403, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Route::get 2nd arg…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40006, 405, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Eloquent is…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40007, 405, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Blade files live in…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40008, 405, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, '@csrf directive…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40009, 405, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Migration files…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40010, 405, 4, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'artisan migrate…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40101, NULL, 4, NULL, 12, 'final_exam', 'multiple_choice', NULL, '.env stores…', 1, 1, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40102, NULL, 4, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Service container…', 1, 2, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40103, NULL, 4, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Validation uses…', 1, 3, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40104, NULL, 4, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Policy authorizes…', 1, 4, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40105, NULL, 4, NULL, 12, 'final_exam', 'multiple_choice', NULL, 'Inertia in this app…', 1, 5, '2026-06-03 09:10:18', '2026-06-03 09:10:18'),
(40111, 414, 5, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'What is Java', 1, 1, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(40112, 414, 5, NULL, 12, 'module_quiz', 'true_false', '{\"correct\":false}', 'Is Java coffee?', 1, 2, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(40113, 414, 5, NULL, 12, 'module_quiz', 'matching', '{\"correct_order\":[],\"pairs\":[{\"id\":\"1\",\"left\":\"Language\",\"right\":\"Java\"},{\"id\":\"1780481503605\",\"left\":\"If\",\"right\":\"Else\"},{\"id\":\"1780481509071\",\"left\":\"Boolean\",\"right\":\"True or False\"}]}', 'Pair the matching elements', 1, 3, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(40114, 414, 5, NULL, 12, 'module_quiz', 'multiple_choice', NULL, 'Is Java good?', 1, 4, '2026-06-03 02:17:51', '2026-06-03 02:17:51'),
(40115, 414, 5, NULL, 12, 'module_quiz', 'true_false', '{\"correct\":false}', 'The module is engaging', 1, 5, '2026-06-03 02:17:51', '2026-06-03 02:17:51');

-- --------------------------------------------------------

--
-- Table structure for table `revenue_splits`
--

CREATE TABLE `revenue_splits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `admin_percentage` decimal(5,2) NOT NULL DEFAULT 30.00,
  `creator_percentage` decimal(5,2) NOT NULL DEFAULT 70.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `contact_no` varchar(50) DEFAULT NULL,
  `affiliation` varchar(255) DEFAULT NULL,
  `role` enum('admin','content_creator','teacher','user') NOT NULL DEFAULT 'user',
  `default_certification_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('active','inactive','pending_verification','declined') NOT NULL DEFAULT 'active',
  `institutional_credentials_url` varchar(500) DEFAULT NULL,
  `verified_by` bigint(20) UNSIGNED DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `sand_dollars` int(11) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `birthday`, `contact_no`, `affiliation`, `role`, `default_certification_id`, `is_active`, `status`, `institutional_credentials_url`, `verified_by`, `verified_at`, `sand_dollars`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(3, 'Admin', 'User', 'admin@gmail.com', '$2y$12$g1vnPm68wDAb5RpuNWmv8.AdccWhjAGKfSWPYke0icnQJ3dBQHAlS', '2000-01-01', '09123456789', 'System Admin', 'admin', NULL, 1, 'active', NULL, NULL, NULL, 0, '2026-06-03 09:10:17', NULL, '2026-06-03 09:10:17', '2026-06-03 09:10:17'),
(9, 'Chi', 'Ligma', 'educavrabina29@gmail.com', '$2y$12$aKWF3rbf4PCEJ/sUkoGQBOUIbR7Axt3CrquWw314w57Jh2u5RT9za', '2000-05-29', '09171234567', 'Playtest Student', 'user', 1, 1, 'active', NULL, NULL, NULL, 0, '2026-06-03 09:10:17', NULL, '2026-06-03 09:10:17', '2026-06-03 09:10:18'),
(11, 'Ahmad', 'Paguta', 'ahmadpaguta2005@gmail.com', '$2y$12$BlAStaFZdhPiLcNpA7bbxOCp2WaDIn3uhFCQJNlrY26qnmvMEhZZm', '2005-01-01', '09181234567', 'Playtest Student', 'user', NULL, 1, 'active', NULL, NULL, NULL, 0, '2026-06-03 09:10:17', NULL, '2026-06-03 09:10:17', '2026-06-03 09:10:17'),
(12, 'Cups', 'Cuddles', 'cupscuddles@gmail.com', '$2y$12$3gECeTWwYOU9ZK7clN/sXumqiwZrXAqJGRR6WpmKOeD0CaPqZyNZa', '1998-03-15', '09191234567', 'Content Creator', 'content_creator', NULL, 1, 'active', NULL, NULL, NULL, 0, '2026-06-03 09:10:17', NULL, '2026-06-03 09:10:17', '2026-06-03 09:10:17'),
(13, 'Roan', 'Baral', 'roanbaral3@gmail.com', '$2y$12$P9gf.a2ei5FcJeSaYvKcbuEgeaankcTnbIhAby7vlmqQc56Nki45W', '2001-07-20', '09201234567', 'Playtest Student', 'user', 2, 1, 'active', NULL, NULL, NULL, 0, '2026-06-03 09:10:17', NULL, '2026-06-03 09:10:17', '2026-06-03 09:10:18'),
(14, 'Busi', 'Avrabina', 'busiavrabina29@gmail.com', '$2y$12$BlAStaFZdhPiLcNpA7bbxOCp2WaDIn3uhFCQJNlrY26qnmvMEhZZm', '2000-08-29', '09211234567', 'Playtest Student', 'user', NULL, 1, 'active', NULL, NULL, NULL, 0, '2026-06-03 09:10:17', NULL, '2026-06-03 09:10:17', '2026-06-03 09:10:17'),
(15, 'Gab', 'Hortaleza', 'slickmails29@gmail.com', '$2y$10$IEzxa9vK8Ja/uUoEIg3BBOyiONukJG5DvsNqMDbi84Bf1gIYrTO4q', '2005-06-03', '09123456789', 'NU Lipa', 'teacher', NULL, 1, 'active', 'credentials/ccJLVkKfKv0dIf9NbRxMy6Z5UoWvo8Z3YAG65qby.jpg', 3, '2026-06-03 01:16:13', 0, '2026-06-03 01:16:00', NULL, '2026-06-03 01:14:49', '2026-06-03 01:16:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `achievement_id` bigint(20) UNSIGNED NOT NULL,
  `unlocked_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_cosmetics`
--

CREATE TABLE `user_cosmetics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` varchar(100) NOT NULL,
  `unlocked_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_daily_quest_progress`
--

CREATE TABLE `user_daily_quest_progress` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `daily_quest_id` bigint(20) UNSIGNED NOT NULL,
  `quest_date` date NOT NULL,
  `progress` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_claimed` tinyint(1) NOT NULL DEFAULT 0,
  `claimed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_module_progress`
--

CREATE TABLE `user_module_progress` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `is_unlocked` tinyint(1) NOT NULL DEFAULT 0,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `fast_track_used` tinyint(1) NOT NULL DEFAULT 0,
  `fast_track_passed` tinyint(1) NOT NULL DEFAULT 0,
  `content_completed` tinyint(1) NOT NULL DEFAULT 0,
  `score` int(11) DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_streaks`
--

CREATE TABLE `user_streaks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `longest_streak` int(11) NOT NULL DEFAULT 0,
  `last_active_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `enrollment_request_id` bigint(20) UNSIGNED NOT NULL,
  `teacher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cohort_id` bigint(20) UNSIGNED DEFAULT NULL,
  `certification_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `used_by` bigint(20) UNSIGNED DEFAULT NULL,
  `issued_at` timestamp NULL DEFAULT current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `enrollment_request_id`, `teacher_id`, `cohort_id`, `certification_id`, `code`, `is_used`, `used_by`, `issued_at`, `used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 1, 15, 1, 2, 'TCH-DPVKXJUAAT', 0, NULL, '2026-06-03 01:16:38', NULL, NULL, '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(2, 1, 15, 1, 2, 'TCH-AOYHP9GXRL', 0, NULL, '2026-06-03 01:16:38', NULL, NULL, '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(3, 1, 15, 1, 2, 'TCH-L7ZWXBU3K2', 0, NULL, '2026-06-03 01:16:38', NULL, NULL, '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(4, 1, 15, 1, 2, 'TCH-KCMRWBWY0Q', 0, NULL, '2026-06-03 01:16:38', NULL, NULL, '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(5, 1, 15, 1, 2, 'TCH-0DW7LYODZI', 0, NULL, '2026-06-03 01:16:38', NULL, NULL, '2026-06-03 01:16:38', '2026-06-03 01:16:38'),
(6, 3, 15, 2, 3, 'TCH-EWI9DSGGJL', 0, NULL, '2026-06-03 01:19:10', NULL, NULL, '2026-06-03 01:19:10', '2026-06-03 01:19:10'),
(7, 3, 15, 2, 3, 'TCH-T3XSDM944T', 0, NULL, '2026-06-03 01:19:10', NULL, NULL, '2026-06-03 01:19:10', '2026-06-03 01:19:10'),
(8, 3, 15, 2, 3, 'TCH-ZSY8N2BBTY', 0, NULL, '2026-06-03 01:19:10', NULL, NULL, '2026-06-03 01:19:10', '2026-06-03 01:19:10'),
(9, 3, 15, 2, 3, 'TCH-JK1TOQ0N8R', 0, NULL, '2026-06-03 01:19:10', NULL, NULL, '2026-06-03 01:19:10', '2026-06-03 01:19:10'),
(10, 3, 15, 2, 3, 'TCH-JY9GWGDVIS', 0, NULL, '2026-06-03 01:19:10', NULL, NULL, '2026-06-03 01:19:10', '2026-06-03 01:19:10');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_requests`
--

CREATE TABLE `withdrawal_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `creator_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','paid','declined') NOT NULL DEFAULT 'pending',
  `requested_at` timestamp NULL DEFAULT current_timestamp(),
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `achievements_slug_unique` (`slug`);

--
-- Indexes for table `admin_invitations`
--
ALTER TABLE `admin_invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_invitations_email_unique` (`email`),
  ADD UNIQUE KEY `admin_invitations_token_unique` (`token`);

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `answers_question_id_foreign` (`question_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificates_certificate_code_unique` (`certificate_code`),
  ADD KEY `certificates_user_id_foreign` (`user_id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `certifications_status_index` (`status`),
  ADD KEY `certifications_created_by_user_id_foreign` (`created_by_user_id`);

--
-- Indexes for table `cohorts`
--
ALTER TABLE `cohorts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cohorts_teacher_id_foreign` (`teacher_id`);

--
-- Indexes for table `cohort_students`
--
ALTER TABLE `cohort_students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cohort_students_cohort_id_foreign` (`cohort_id`),
  ADD KEY `cohort_students_user_id_foreign` (`user_id`);

--
-- Indexes for table `cosmetic_items`
--
ALTER TABLE `cosmetic_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cosmetic_items_type_index` (`type`),
  ADD KEY `cosmetic_items_is_active_index` (`is_active`);

--
-- Indexes for table `creator_earnings`
--
ALTER TABLE `creator_earnings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_earnings_creator_id_foreign` (`creator_id`),
  ADD KEY `creator_earnings_status_index` (`status`);

--
-- Indexes for table `daily_quests`
--
ALTER TABLE `daily_quests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `daily_quests_slug_unique` (`slug`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_verifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollments_user_id_foreign` (`user_id`),
  ADD KEY `enrollments_certification_id_foreign` (`certification_id`),
  ADD KEY `enrollments_status_index` (`status`);

--
-- Indexes for table `enrollment_requests`
--
ALTER TABLE `enrollment_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollment_requests_user_id_foreign` (`user_id`),
  ADD KEY `enrollment_requests_status_index` (`status`);

--
-- Indexes for table `equipped_cosmetics`
--
ALTER TABLE `equipped_cosmetics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `equipped_cosmetics_user_id_unique` (`user_id`);

--
-- Indexes for table `exam_attempts`
--
ALTER TABLE `exam_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_attempts_user_id_foreign` (`user_id`),
  ADD KEY `exam_attempts_passed_index` (`passed`);

--
-- Indexes for table `exam_attempt_answers`
--
ALTER TABLE `exam_attempt_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_attempt_answers_attempt_id_foreign` (`attempt_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `gamification_events`
--
ALTER TABLE `gamification_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gamification_events_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `gamification_events_event_type_index` (`event_type`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `learning_materials`
--
ALTER TABLE `learning_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `learning_materials_certification_id_foreign` (`certification_id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lessons_certification_id_foreign` (`certification_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `modules_lesson_id_foreign` (`lesson_id`);

--
-- Indexes for table `module_content`
--
ALTER TABLE `module_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `module_content_module_id_foreign` (`module_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_provider_invoice_id_unique` (`provider_invoice_id`),
  ADD KEY `payments_enrollment_request_id_foreign` (`enrollment_request_id`),
  ADD KEY `payments_status_index` (`status`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_module_id_foreign` (`module_id`),
  ADD KEY `questions_certification_id_foreign` (`certification_id`),
  ADD KEY `questions_question_type_index` (`question_type`);

--
-- Indexes for table `revenue_splits`
--
ALTER TABLE `revenue_splits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `revenue_splits_certification_id_unique` (`certification_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_index` (`role`),
  ADD KEY `users_status_index` (`status`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_achievements_user_achievement_unique` (`user_id`,`achievement_id`);

--
-- Indexes for table `user_cosmetics`
--
ALTER TABLE `user_cosmetics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_cosmetics_user_id_foreign` (`user_id`),
  ADD KEY `user_cosmetics_item_id_foreign` (`item_id`);

--
-- Indexes for table `user_daily_quest_progress`
--
ALTER TABLE `user_daily_quest_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_quest_date_unique` (`user_id`,`daily_quest_id`,`quest_date`);

--
-- Indexes for table `user_module_progress`
--
ALTER TABLE `user_module_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_module_progress_user_id_foreign` (`user_id`),
  ADD KEY `user_module_progress_is_completed_index` (`is_completed`);

--
-- Indexes for table `user_streaks`
--
ALTER TABLE `user_streaks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_streaks_user_id_unique` (`user_id`),
  ADD KEY `user_streaks_longest_streak_index` (`longest_streak`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vouchers_code_unique` (`code`),
  ADD KEY `vouchers_certification_id_foreign` (`certification_id`);

--
-- Indexes for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `withdrawal_requests_creator_id_foreign` (`creator_id`),
  ADD KEY `withdrawal_requests_status_index` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin_invitations`
--
ALTER TABLE `admin_invitations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=305;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cohorts`
--
ALTER TABLE `cohorts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cohort_students`
--
ALTER TABLE `cohort_students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `creator_earnings`
--
ALTER TABLE `creator_earnings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daily_quests`
--
ALTER TABLE `daily_quests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `enrollment_requests`
--
ALTER TABLE `enrollment_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `equipped_cosmetics`
--
ALTER TABLE `equipped_cosmetics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_attempts`
--
ALTER TABLE `exam_attempts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_attempt_answers`
--
ALTER TABLE `exam_attempt_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gamification_events`
--
ALTER TABLE `gamification_events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `learning_materials`
--
ALTER TABLE `learning_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=422;

--
-- AUTO_INCREMENT for table `module_content`
--
ALTER TABLE `module_content`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40116;

--
-- AUTO_INCREMENT for table `revenue_splits`
--
ALTER TABLE `revenue_splits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_cosmetics`
--
ALTER TABLE `user_cosmetics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_daily_quest_progress`
--
ALTER TABLE `user_daily_quest_progress`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_module_progress`
--
ALTER TABLE `user_module_progress`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_streaks`
--
ALTER TABLE `user_streaks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
