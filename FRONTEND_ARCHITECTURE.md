# Sandbox LMS - Frontend Architecture & UI/UX Design System

## 1. Full Design System Direction
The Sandbox LMS adopts a **"Sophisticated Coastal"** design system. It avoids neon gaming tropes in favor of a clean, structured SaaS interface (like Linear or Notion) but injects subtle beach-themed coloring (ocean, sand) and terminology (Shells, Sandboxes) to create a relaxed, engaging learning environment. The focus is 90% on content readability and usability, and 10% on gamification (badges, streaks, subtle progress animations).

## 2. Tailwind Color Palette
Configured in `tailwind.config.js`:
- **Backgrounds**: `sand-50` (#fdfbf7) for main app background, pure `white` for cards.
- **Primary Accents**: `ocean-600` (#0284c7) for buttons, active states, and links.
- **Secondary Accents**: `teal-500` (#14b8a6) for success states, completed modules, and badges.
- **Typography**: `navy-900` (#0f172a) for primary text, `navy-800` for secondary text.
- **Borders/Dividers**: `sand-200` (#f0e8d9) to keep lines warm and soft instead of harsh grays.

## 3. Typography Recommendations
- **Primary Font**: `Inter` (or `Figtree`) for all UI elements—highly legible at small sizes.
- **Headings**: Semi-bold, tight tracking (e.g., `text-2xl font-semibold tracking-tight`).
- **Body**: Muted navy (`text-navy-800`), properly spread using `leading-relaxed` for heavy text areas (lessons).

## 4. Layout Hierarchy
- **Level 1 (Highest)**: Top Navbar (global search, notifications, profile, currency/Sand Dollars).
- **Level 2**: Main Sidebar (collapsible, contextual to Role).
- **Level 3**: Page Header (Breadcrumbs, Page Title, Primary Action Button).
- **Level 4**: Content Container (Max-width limited for readability, grid/card-based layouts).

## 5. Sidebar Structure
**Student**
- ?? Dashboard (Continue Learning)
- ?? Marketplace (Discover)
- ?? My Shells (Enrolled)
- ?? Leaderboard
- ?? Shop (Cosmetics)
- ?? Profile

**Creator** 
- ?? Dashboard (Overview/Analytics)
- ?? My Shells (CMS)
- ?? Withdrawals

*(Admin and Teacher structured similarly per route constraints)*

## 6. Dashboard Structure
- **Top Row**: Greeting + Quick Stats (Streak ??, Sand Dollars ??).
- **Hero Banner**: "Continue Learning" (Last viewed Shell/Module with progress bar and play button).
- **Grid Row**: "My Shells" cards (thumbnails, progress bars).
- **Sidebar/Right Column**: Recent Activity / Upcoming Cohort deadlines.

## 7. Marketplace Structure
- **Header**: Search bar + Category filters (pill buttons using `bg-sand-100`).
- **Grid**: 3 to 4 column grid of Shell Cards.
- **Cards**:
  - Top: 16:9 Image thumbnail
  - Middle: Title, Creator Avatar + Name, Rating
  - Bottom: Price ($) and "Enroll" button.

## 8. React Component Breakdown
**Atomic structure:**
- `/Components/UI`: Button, Input, Modal, Badge, ProgressBar, Toast.
- `/Components/Layout`: Sidebar, Topbar, PageHeader.
- `/Components/Shell`: ShellCard, ModuleList, VideoPlayer.
- `/Components/Gamification`: StreakCounter, SandDollarBalance.

## 9. Inertia Page Structure
Directories mirror the routes exactly:
- `Pages/Student/Dashboard.jsx`
- `Pages/Student/Marketplace.jsx`
- `Pages/Shared/Shell/View.jsx` (Shared between Creator preview and Student view)
- `Pages/Shared/Module/View.jsx`

## 10. Recommended Reusable Components
- `<Card>`: White background, subtle shadow, `border-sand-200` rounding.
- `<ProgressBar>`: Animated width, `bg-teal-500`.
- `<ShellCard>`: Standardized grid item for Marketplace and My Shells.
- `<EmptyState>`: Friendly illustration + call to action when a list is empty.

## 11. Suggested Folder Structure for Frontend
```
resources/js/
+-- Components/
¦   +-- UI/            # Buttons, Inputs
¦   +-- Layout/        # Nav, Sidebar
¦   +-- Domain/        # ShellCards, Quizzes
+-- Hooks/             # useAudio, useConfetti
+-- Layouts/           # AppLayout, GuestLayout, ModuleLayout
+-- Pages/
¦   +-- Admin/
¦   +-- Creator/
¦   +-- Student/
¦   +-- Teacher/
¦   +-- Auth/
+-- Utils/             # formatter, helpers
```

## 12. Modern LMS UX Recommendations
- **Distraction-Free Mode**: When a student enters a "Sandbox" (module), the main sidebar collapses automatically.
- **Visual Progress**: Progress bars should be ubiquitous (on cards, inside modules).
- **Keyboard Navigation**: In quizzes, allow A/B/C/D keypresses.
- **Chunking**: Break video and text content into smaller logical cards.

## 13. Minimal Framer Motion Integration Ideas
- **Page Transitions**: Simple `opacity: 0` to `1` over 0.2s (`<motion.main>`).
- **Rewards**: When submitting a Sandbox, a subtle `<motion.div>` scales up from `0.8` to `1.0` to show Sand Dollars earned.
- **Layout Shifts**: `<motion.ul layout>` for draggable/sortable module lessons in the Creator dashboard.

## 14. Suggested Responsive Layout Behavior
- **Desktop (>1024px)**: Sidebar pinned open, 3-4 column grids.
- **Tablet (768px-1024px)**: Sidebar collapsed to icons, 2 column grids.
- **Mobile (<768px)**: Bottom Navigation Bar instead of Sidebar. Grids become 1 column.
