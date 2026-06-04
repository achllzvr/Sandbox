# Sandbox QA Edge Cases

Comprehensive manual verification checklist aligned with the Sandbox Next Updates release. Run after migrations (`php artisan migrate`) and a fresh frontend build (`npm run build`).

## A. Authentication and roles

- [ ] Student, teacher, creator, and admin can log in and reach the correct dashboard.
- [ ] Inactive or suspended users are blocked by middleware.
- [ ] Student email verification gates still apply; staff accounts remain auto-verified.
- [ ] Role middleware prevents cross-dashboard access.

## B. Student shell flow

- [ ] Material preview works for PDF, PPT, and video modules; page navigation and finish gating behave as before.
- [ ] Test vs quiz module types still route correctly.
- [ ] Review mode opens **materials first**, not results.
- [ ] Attempt history tabs show latest first with correct/wrong breakdown.
- [ ] AI assistant appears on material study and is **hidden during tests and final exam**.
- [ ] Quiz animation runs once per question; returning from a sandbox does not replay shell-map enter animation.
- [ ] **Voucher/cohort final exam dual gate:** all sandboxes complete **and** teacher unlocked required.
- [ ] **Direct purchase:** final exam available when all sandboxes complete (no teacher gate).
- [ ] Final exam UI states: locked (incomplete sandboxes), waiting (complete but teacher not unlocked), ready (both satisfied).
- [ ] Direct URL exam submit with incomplete modules returns 403.
- [ ] Voucher student with complete modules but no teacher unlock gets 403 on submit.

## C. Teacher voucher manager

- [ ] Send voucher email updates DB before mail; DB failure shows error and does not send mail.
- [ ] Validation errors appear in the send modal.
- [ ] Resend respects `sent_to_email_at`; recipient email shown in voucher list.
- [ ] Bulk **Unlock final exams** POST works; success toast and voucher/enrollment flags update.
- [ ] Redeemed student receives enrollment unlock; invited email receives unlock on claim if voucher pre-unlocked.
- [ ] Unlock does **not** bypass sandbox progress.
- [ ] Timestamps in teacher tables display in `APP_TIMEZONE` (default Asia/Manila).

## D. Marketplace / shop

- [ ] Badge type `professional_certificate` shows fixed label and verified icon.
- [ ] Badge type `custom` shows creator label and optional icon toggle on shop and shell map.
- [ ] **Try a quick test** opens diagnostic modal; questions load, grade, no enrollment side effects.
- [ ] Direct purchase webhook creates enrollment and a `creator_earnings` row.

## E. Creator studio

- [ ] Badge settings save and reflect on shop/shell map.
- [ ] Multiple shell units: titles appear as map dividers; new sandboxes can target a unit.
- [ ] Quick Test (diagnostic) CRUD saves up to 5 questions.
- [ ] Gemini generation still works; system key rotation fails over to the next configured key.

## F. Creator wallet / Admin finance

- [ ] After purchase, creator available balance increases.
- [ ] Admin master ledger shows **Total paid**, platform cut, and creator cut.
- [ ] Pending withdrawal requests reduce available balance until paid/declined.
- [ ] Admin marking withdrawal paid marks linked earnings withdrawn; double-withdraw prevented.
- [ ] Finance filters (search, status, date range) persist in the query string.

## G. Admin

- [ ] Dashboard cards match DB counts; charts render empty states gracefully without “TODO: live data” badges.
- [ ] User management supports role, status, and sort filters via URL query string.
- [ ] Certification publish/archive/restore and user suspend/archive use modals (not browser `confirm()`).
- [ ] Certification review approve uses a confirmation modal.

## H. AI / Gemini

- [ ] Key 1 quota rotates to key 2 transparently.
- [ ] All keys exhausted shows: “AI is temporarily unavailable — all API keys are rate-limited.”
- [ ] Custom creator API key path is unchanged.

## I. Timezone

- [ ] `APP_TIMEZONE=Asia/Manila` in `.env` formats teacher voucher, finance, and purchase timestamps correctly.
- [ ] Cross-check a known UTC DB timestamp against expected Philippine local time.

## J. Regression / edge cases

- [ ] Retake test creates a new attempt; history remains ordered latest first.
- [ ] Quiz-only module review opens results directly.
- [ ] PDF.js rendering limitation: document if preview artifacts appear (optional open-in-new-tab fallback).
- [ ] Concurrent voucher email send does not duplicate-send on partial failure.
- [ ] Expired or already-used voucher send is blocked.
- [ ] Exam submit allowed when modules complete + teacher unlocked (voucher) or modules complete (direct purchase).

## Known limitations

- Existing paid payments before this release do not have `creator_earnings` rows until new purchases occur (optional backfill command not included).
- PDF preview may show rendering artifacts depending on browser PDF.js support.

## Verification pass log

| Date | Tester | Area | Result | Notes |
|------|--------|------|--------|-------|
| 2026-05-31 | Engineering | Migration + voucher email order | Pass | `2026_06_04_000000_sandbox_next_updates_schema` applied locally |
| 2026-05-31 | Engineering | Final exam dual gate wiring | Pass | Teacher POST + student map + ExamController enforced |
| 2026-05-31 | Engineering | Creator earnings on payment | Pass | Service hooked in both provisioning paths |
| 2026-05-31 | Engineering | Admin modals + user sort/filter | Pass | Confirm modals + query string filters |
| 2026-05-31 | Engineering | Gemini key pool | Pass | Keys outer / models inner rotation |
| 2026-05-31 | Engineering | Creator badge/units/diagnostic | Pass | Editor extras + shop quick test modal |
