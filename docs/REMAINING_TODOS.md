# Remaining TODOs by User Type

Living backlog after the refinement plan implementation (June 2026). See [`SANDBOX_MASTER_PLAN.md`](SANDBOX_MASTER_PLAN.md) for completed phase checklist.

---

## Admin

| Area | Status | Notes |
|------|--------|-------|
| Finance CSV export | Open | Export button shows placeholder modal |
| Webhook manual override / revoke | Open | UI stub only |
| Audit log writes on all mutations | Partial | Some actions log; not exhaustive |
| Cert review PPTX embed / storage:link | Open | Environment-dependent preview issues |
| Live affiliation list for admin invites | Open | `CreateUserFlow` still uses hardcoded affiliations |

---

## Content Creator

| Area | Status | Notes |
|------|--------|-------|
| YouTube sources in AI generation | Open | UI excludes video/YouTube from Gemini picker |
| Legacy `onApplyMock` prop name | Open | Cosmetic rename in `Edit.jsx` |
| Async KB build queue | Optional | KB builds synchronously on exam save today |

---

## Student

| Area | Status | Notes |
|------|--------|-------|
| Shop diagnostic pre-assessment | Open | "Try a quick test" toast only |
| Review AI chat history persistence | Optional | In-memory per session only |

---

## Teacher

| Area | Status | Notes |
|------|--------|-------|
| Unlock final exams for voucher batch | Open | Toast placeholder on shell show |
| Legacy mock classes in `app/Support/Mocks/Teacher/` | Cleanup | Unused; safe to delete when confirmed |

---

## Shared / Auth

| Area | Status | Notes |
|------|--------|-------|
| Accept invite affiliation document upload | Open | `AcceptInvite.jsx` placeholder copy |
| `routes/api.php` Sanctum stubs | Deferred | No mobile API yet |

---

## Student Review AI (implemented)

- **Knowledge base** — built on final exam save; validated on submit ([`CertificationKnowledgeBuilder`](../app/Services/Ai/CertificationKnowledgeBuilder.php))
- **Student chat** — [`ReviewAssistantPanel`](../resources/js/Components/Student/ReviewAssistantPanel.jsx) on enrolled shell map when KB is `ready`
- **Schema** — `certification_knowledge_bases` in [`database/sql/post_restore_patches.sql`](../database/sql/post_restore_patches.sql)

**Setup:** Apply SQL patch on existing DBs; set `GEMINI_API_KEY` in `.env`.

---

## Database patches to apply

```bash
# After phpMyAdmin restore
mysql -u root -P 3308 sandbox_db < database/sql/post_restore_patches.sql
```

Also run archived certification migration if using Laravel migrations:

```bash
php artisan migrate --path=database/migrations/2026_06_03_120000_add_archived_status_to_certifications.php
```
