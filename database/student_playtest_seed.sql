-- =============================================================================
-- SANDBOX — Student playtest seed
--
-- If the database was wiped (empty/wrong schema), use the all-in-one restore:
--   database/sandbox_full_restore.sql   (phpMyAdmin SQL tab on blank sandbox_db)
--   php artisan db:restore-playtest --force
--
-- Re-seed content only (users must already exist):
--   mysql -h 127.0.0.1 -P 3308 -u root sandbox_db < database/student_playtest_seed.sql
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
--   Minimum 1280×720 (16:9). Filenames:
--   full-demo.png | react-basics.png | java-basics.png | laravel-basics.png
-- Then: php artisan storage:link
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
START TRANSACTION;

DELETE FROM exam_attempt_answers;
DELETE FROM exam_attempts;
DELETE FROM certificates;
DELETE FROM user_module_progress;
DELETE FROM user_streaks;
DELETE FROM user_cosmetics;
DELETE FROM equipped_cosmetics;
DELETE FROM answers;
DELETE FROM questions;
DELETE FROM module_content;
DELETE FROM modules;
DELETE FROM lessons;
DELETE FROM learning_materials;
DELETE FROM enrollments;
DELETE FROM payments;
DELETE FROM enrollment_requests;
DELETE FROM vouchers;
DELETE FROM cohort_students;
DELETE FROM cohorts;
DELETE FROM creator_earnings;
DELETE FROM revenue_splits;
DELETE FROM certifications;

UPDATE users SET sand_dollars = 0, default_certification_id = NULL WHERE role = 'user';
UPDATE users SET default_certification_id = 1 WHERE id = 9;
UPDATE users SET default_certification_id = 2 WHERE id = 13;

INSERT INTO certifications (
    id, title, description, category, difficulty, estimated_duration, thumbnail,
    learning_objectives, prerequisites, tags, price, pass_threshold, status,
    submitted_at, created_by_user_id, approved_by, approved_at, created_at, updated_at
) VALUES
(1, 'FULL DEMO', '10 sandboxes, 4 units, quizzes on #3/#7/#10, final exam.', 'Demo', 'Beginner', '2 hours', 'shell-covers/full-demo.png', 'Full student journey.', 'None', '["demo"]', 0.00, 70, 'published', NOW(), 12, 3, NOW(), NOW(), NOW()),
(2, 'REACT BASICS', 'React components, JSX, state, hooks.', 'Technology', 'Beginner', '4 hours', 'shell-covers/react-basics.png', 'Build UI with React.', 'HTML & JS', '["react"]', 0.00, 75, 'published', NOW(), 12, 3, NOW(), NOW(), NOW()),
(3, 'JAVA BASICS', 'Java OOP and collections.', 'Technology', 'Intermediate', '6 hours', 'shell-covers/java-basics.png', 'Core Java skills.', 'Programming logic', '["java"]', 499.00, 75, 'published', NOW(), 12, 3, NOW(), NOW(), NOW()),
(4, 'LARAVEL BASICS', 'Routes, Eloquent, Blade.', 'Technology', 'Intermediate', '5 hours', 'shell-covers/laravel-basics.png', 'Laravel MVC.', 'PHP basics', '["laravel"]', 799.00, 75, 'published', NOW(), 12, 3, NOW(), NOW(), NOW());

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
(31, 3, 12, 'UNIT 1 — JAVA CORE', 'OOP.', 1),
(32, 3, 12, 'UNIT 2 — COLLECTIONS', 'Collections.', 2),
(41, 4, 12, 'UNIT 1 — LARAVEL MVC', 'MVC.', 1),
(42, 4, 12, 'UNIT 2 — ELOQUENT & BLADE', 'DB & views.', 2);

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
(405, 42, 12, 12, 'Blade & Views Quiz', NULL, 0, 2, 5);

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
(404, 12, 'youtube_embed', 'Eloquent', 'https://www.youtube.com/embed/Imx223jqqEE', 1);

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

-- =============================================================================
-- ANSWER KEY (letter = order shown in UI: 1st=A, 2nd=B, 3rd=C, 4th=D)
-- =============================================================================
-- FULL DEMO / Foundations (103): B, C, D, D, B
-- FULL DEMO / Advanced (107):    C, D, C, B, C
-- FULL DEMO / Review (110):      D, B, B, C, D
-- FULL DEMO / Final:             B, C, D, D, B
-- REACT / Checkpoint (203):      C, D, C, B, C
-- REACT / Hooks (205):           D, B, B, C, D
-- REACT / Final:                 C, D, D, B, C
-- JAVA / OOP (303):              C, C, D, A, B
-- JAVA / Collections (305):      B, C, C, B, D
-- JAVA / Final:                  B, B, C, C, D
-- LARAVEL / Routing (403):       B, B, D, A, B
-- LARAVEL / Blade (405):         C, B, C, B, D
-- LARAVEL / Final:               C, B, B, B, C
