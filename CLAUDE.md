# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (first time)
composer install
npm install

# Generate app key (first time, after creating .env)
php artisan key:generate

# Create storage symlink for uploaded files (first time)
php artisan storage:link

# Frontend assets
npm run dev       # Vite dev server with HMR
npm run build     # Production build

# Code formatting
./vendor/bin/pint

# Tests
./vendor/bin/phpunit                        # All tests
./vendor/bin/phpunit --filter TestName     # Single test

# Database
php artisan migrate                         # Run migrations
php artisan db:seed                         # Seed admin user (admin@example.com / admin123)
```

The app runs via XAMPP at `http://localhost/Sandbox/public`.

## Architecture

Laravel 9 MVC application with role-based access control. Three user roles: `admin`, `content_creator`, `user`.

**Authentication flow**: Custom session-based auth via `AuthController` (not Laravel Breeze/Jetstream). On login, the session stores `user_id`, `role`, `first_name`, `last_name`, `full_name`, `email`. The `CheckRole` middleware (`app/Http/Middleware/CheckRole.php`) guards all role-specific routes — it checks `session('role')` on every request and also re-validates `is_active` and email verification status.

**Database**: The schema lives in `database/certifications.sql` — use this to import via phpMyAdmin. The Laravel migrations in `database/migrations/` are standard stubs and do not represent the actual schema.

**Role-separated controllers**:
- `app/Http/Controllers/Admin/AdminController.php` — staff account management, certification/lesson creation, vouchers, enrollment approval
- `app/Http/Controllers/Staff/StaffController.php` — lesson/module creation, file uploads, quiz questions
- `app/Http/Controllers/UserDashboardController.php` — learner-facing views and enrollment

> Note: An unused duplicate exists at `app/Http/Controllers/StaffController.php` (no namespace subfolder). Only the `Staff\StaffController` is registered in routes.

**Data model**:
```
Certification (admin-created, has price + pass_threshold)
  └── Lesson (staff or admin-created)
        └── Module (staff-uploaded: PDF/DOC/DOCX/PPT/PPTX/MP4/MOV/JPG/PNG/GIF, max 50MB)
              └── Question (max 5 per module, 4 options A–D, correct_answer stored as a/b/c/d)
EnrollmentRequest (status: pending | approved | rejected, $timestamps = false, uses requested_at/reviewed_at)
Voucher (discount_type: percent | fixed, tracks uses_count vs max_uses)
User (role: admin | staff | user, is_active bool, email_verified_at)
EmailVerification (OTP: 6-digit, expires in 5 min, max 5 attempts, max 3 resends)
```

**Email verification** (users only, not staff/admin): OTP is a 6-digit code hashed in `email_verifications`. Rate-limited routes: 6 verify attempts/min, 3 resends/min. Staff accounts are auto-verified (`email_verified_at = now()`) on creation.

**File uploads**: Stored in `storage/app/public/modules/`. Requires the `storage:link` symlink. Filename is slugified + timestamp to avoid collisions.

**Enrollment quirk**: `UserDashboardController::enroll()` inserts enrollment records directly with `status = 'approved'` and uses `auth()->id()` (Laravel's auth guard) rather than `session('user_id')` like other controllers. The admin `approveEnrollment` action is for a separate admin-managed pending flow.

**Views**: Two layouts — `resources/views/layouts/app.blade.php` (public/auth pages) and `layouts/dashboard.blade.php` (authenticated dashboards). Reusable Blade components live in `resources/views/components/` (button, card, footer, input, navbar).

**Emails**: Three Mailable classes in `app/Mail/` with Blade templates in `resources/views/emails/`. Mailpit on port 1025 is the default for local dev.

**API**: `routes/api.php` uses Laravel Sanctum token auth. The API routes are stubs — the referenced controller methods (`storeStaff`, `storeCertification`, `storeLesson`, `storeModule`, `storeModuleContent`) do not exist yet.
