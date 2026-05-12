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

The app runs via XAMPP at `http://localhost/certifications-main/public`.

## Architecture

Laravel 9 MVC application with role-based access control. Three user roles: `admin`, `content_creator`, `user`.

**Authentication flow**: Custom session-based auth via `AuthController` (not Laravel Breeze/Jetstream). On login, the session stores `user_id`, `role`, `first_name`, `last_name`, `email`. The `CheckRole` middleware (`app/Http/Middleware/CheckRole.php`) guards all role-specific routes.

**Database**: The schema lives in `database/certifications.sql` — use this to import via phpMyAdmin. The Laravel migrations in `database/migrations/` are standard stubs and do not represent the actual schema.

**Role-separated controllers**:
- `app/Http/Controllers/Admin/AdminController.php` — content_creator account creation, certification creation
- `app/Http/Controllers/Content Creator/StaffController.php` — lesson/module creation, file uploads
- `app/Http/Controllers/UserDashboardController.php` — learner-facing views

**Data model**:
```
Certification (admin-created)
  └── Lesson (content_creator-created)
        └── Module (content_creator-uploaded: PDF/DOC/DOCX/MP4/MOV, max 20MB)
              └── ModuleContent
User (role: admin | content_creator | user)
```

**File uploads**: Stored in `storage/app/public/modules/`. Requires the `storage:link` symlink to be accessible from `public/storage`.

**Emails**: Two Mailable classes in `app/Mail/` with Blade templates in `resources/views/emails/`. Mailpit on port 1025 is the default for local dev.

**API**: `routes/api.php` uses Laravel Sanctum token auth alongside the session-based web routes.
