# SANDBOX — Master UI Styling Guide

> Derived from full mockup analysis across all 13 screens:
> Landing, Log In, Sign Up (×5), Forgot Password (×5)

---

## 1. Design Language Overview

**App Name:** Sandbox  
**Mascot:** "Hermit" — a kawaii hermit crab character with a swirled shell  
**Personality:** Playful, warm, educational, encouraging — like a friendly learning sandbox environment  
**Visual Tone:** Soft kawaii + casual-educational. Think: cozy storybook meets ed-tech app  
**Aesthetic Keywords:** Bubbly, rounded, warm beige, coral salmon, hand-crafted feel, approachable, non-intimidating

---

## 2. Color Palette

All values derived from pixel-accurate analysis of the mockup images.

### Primary Colors

| Role | Name | Hex (approximate) | Usage |
|---|---|---|---|
| Background | Warm Cream | `#FAF0DC` | Page backgrounds, nav bar |
| Primary Action | Coral Salmon | `#E8735A` | Primary buttons (LOG IN, GET STARTED, CREATE SHELL, etc.) |
| Primary Action Hover/Dark | Dark Coral | `#A04035` | Right-side portion of split-progress buttons, hover state |
| Secondary Button | Sandy Yellow | `#E8C97A` | "I ALREADY HAVE A SHELL" button border/background tint |
| Input Field Background | Light Sandy | `#F2E4BF` | All text input fields |
| Input Border | Warm Tan | `#D4BC8A` | Input field border |
| Heading/Body Text | Dark Brown-Gray | `#4A3F35` | All headings, body text |
| Placeholder Text | Muted Tan | `#B09A78` | Input placeholders, helper text |
| Error Banner Background | Soft Pink-Red | `#F4A0A0` | Error state banner (e.g., "Incorrect Code. Please try again.") |
| Error Text | White | `#FFFFFF` | Text inside error banners |
| Success Indicator | Leaf Green | `#4CAF50` | Password requirement list items when met |
| Link Text | Muted Blue-Gray | `#7A8FA6` | Underlined links (Terms, Privacy Policy, partnership link) |
| Nav Bar Border Bottom | Light Warm Gray | `#E8DCcc` | Thin bottom border of nav bar separator |

### CSS Custom Properties (Variables)

```css
:root {
  /* Backgrounds */
  --color-bg:               #FAF0DC;
  --color-nav-bg:           #FAF0DC;
  --color-input-bg:         #F2E4BF;

  /* Brand / Actions */
  --color-primary:          #E8735A;
  --color-primary-dark:     #A04035;
  --color-secondary-border: #E8C97A;

  /* Borders */
  --color-input-border:     #D4BC8A;
  --color-nav-border:       #E8DCCC;

  /* Text */
  --color-text-heading:     #4A3F35;
  --color-text-body:        #4A3F35;
  --color-text-placeholder: #B09A78;
  --color-text-link:        #7A8FA6;
  --color-text-helper:      #8C7A62;

  /* States */
  --color-error-bg:         #F4A0A0;
  --color-error-text:       #FFFFFF;
  --color-success:          #4CAF50;

  /* Shadows — Hard/flat Duolingo-style: NO blur, NO spread, solid Y-offset only */
  --shadow-btn-primary:   0 5px 0 0 #A04035;     /* coral button bottom edge */
  --shadow-btn-secondary: 0 5px 0 0 #B89A3A;     /* sandy outlined button bottom edge */
  --shadow-input:         0 4px 0 0 #C4AC7A;     /* input field bottom edge */
  --shadow-card:          0 5px 0 0 #C8B88A;     /* cards / containers bottom edge */
  --shadow-error-banner:  0 5px 0 0 #D07070;     /* error banner bottom edge */
  --shadow-back-btn:      0 4px 0 0 #C4AC7A;     /* back button bottom edge */
}
```

---

## 3. Typography

### Font Families

All three fonts are **locally downloaded** and must be loaded via `@font-face`. Do **not** use Google Fonts imports for these.

| Role | Font | Style | Notes |
|---|---|---|---|
| Logo / Brand wordmark ("SANDBOX") | **Sparky Stones** | Regular | The chunky, rounded, bubble-letter display font used for the app name in the navbar |
| Page Titles & Headings | **Montley Forces** | Bold | Used for all auth page headings: "Log in", "Create your Hermit", "Forgot Password", "Verify your Hermit", "Your Hermit has been created!", "New Password Set!" |
| Body, Labels, Buttons, Helper Text | **Roboto** | Regular / Medium / Bold | All form labels, input placeholders, button text, body copy, helper text, footer disclaimers, error banners, password requirements |

### @font-face Declarations

Place these at the top of your global CSS file. Adjust file paths to match your project's font directory.

```css
/* Sparky Stones — Logo / Brand */
@font-face {
  font-family: 'Sparky Stones';
  src: url('/fonts/SparkyStones.woff2') format('woff2'),
       url('/fonts/SparkyStones.woff') format('woff'),
       url('/fonts/SparkyStones.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Montley Forces — Headings */
@font-face {
  font-family: 'Montley Forces';
  src: url('/fonts/MontleyForces.woff2') format('woff2'),
       url('/fonts/MontleyForces.woff') format('woff'),
       url('/fonts/MontleyForces.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Roboto — Body, UI, Buttons */
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto-Regular.woff2') format('woff2'),
       url('/fonts/Roboto-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto-Medium.woff2') format('woff2'),
       url('/fonts/Roboto-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto-Bold.woff2') format('woff2'),
       url('/fonts/Roboto-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### CSS Font Variables

```css
:root {
  --font-brand:    'Sparky Stones', cursive;   /* SANDBOX logo only */
  --font-heading:  'Montley Forces', cursive;  /* All page/section titles */
  --font-body:     'Roboto', sans-serif;        /* Everything else */
}
```

### Font Assignment by Element

```css
/* Brand logo text */
.navbar-logo-text {
  font-family: var(--font-brand);
}

/* All page-level headings */
h1, h2, .page-title, .success-heading, .error-banner p {
  font-family: var(--font-heading);
}

/* All body, UI, and interactive elements */
body, input, select, button, label, p, a, li, span {
  font-family: var(--font-body);
}
```

### Font Size Scale

```css
:root {
  --font-display:   2rem;        /* Hero headline: "Break out of your shell..." */
  --font-h1:        1.875rem;    /* Page titles: "Log in", "Create your Hermit" */
  --font-h2:        1.5rem;      /* Section headers */
  --font-body:      1rem;        /* Body text, form labels */
  --font-small:     0.875rem;    /* Helper text, "Make it yours!", "10s TO RESEND" */
  --font-xsmall:    0.75rem;     /* Fine print, Terms & Privacy links */
  --font-btn:       0.875rem;    /* Button labels — ALL CAPS */
}
```

### Font Weight Reference

| Weight | Value | Used For |
|---|---|---|
| Regular | 400 | Placeholder text, body paragraphs, footer disclaimer |
| Medium | 500 | Input values, helper text, form labels |
| Bold | 700 | Button labels, error banner text, password requirement items, inline actions (FORGOT?, GENERATE) |

### Typography Rules

- **Logo** uses `Sparky Stones` — only ever in the navbar brand mark
- **Page titles** (`Create your Hermit`, `Log in`, `Forgot Password`) use `Montley Forces` at `var(--font-h1)` (~1.875rem), color `var(--color-text-heading)`, centered on auth pages
- **Button labels** use `Roboto` 700, **UPPERCASE**, letter-spacing ~0.08em
- **Helper text** (e.g., `Make it yours! You can change your username every 31 days.`) uses `Roboto` 500, ~0.875rem, color `var(--color-text-helper)`
- **Links** (Terms, Privacy Policy) use `Roboto` 400–500, underlined, color `var(--color-text-link)`
- **Error banner text** uses `Montley Forces` or `Roboto` 700, white, centered, ~1.2rem
- **Password requirement items** use `Roboto` 600, ~0.875rem; `var(--color-text-placeholder)` when unmet, `var(--color-success)` when met
- **Inline input actions** (FORGOT?, GENERATE, 10s TO RESEND NEW CODE) use `Roboto` 700, uppercase, ~0.8rem

---

## 4. Layout & Spacing

### Page Structure

```
┌──────────────────────────────────────────┐
│  NAV BAR  (height: ~70px desktop / ~60px mobile) │
├──────────────────────────────────────────┤
│  BACK BUTTON (top-left, ~40px from nav)           │
│                                                    │
│  PAGE CONTENT (centered, max-width: ~480px)        │
│    - Title                                         │
│    - Form fields / content                         │
│    - CTA Button                                    │
│    - Footer text                                   │
└──────────────────────────────────────────┘
```

### Spacing Scale

```css
:root {
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   16px;
  --space-lg:   24px;
  --space-xl:   32px;
  --space-2xl:  48px;
  --space-3xl:  64px;
}
```

### Page Layout Rules

- Background: full-bleed `var(--color-bg)` on `<html>` and `<body>`
- Nav bar: fixed top, ~70px height, same cream background, thin bottom border `1px solid var(--color-nav-border)`
- Content area: centered column, max-width `480px`, horizontal padding `24px`
- Title-to-first-field gap: ~32–40px
- Between form fields: ~16px vertical gap
- Between last field and CTA button: ~24–32px
- Footer disclaimer: ~48px below button, centered, muted

### Back Button

```css
.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-input-bg);
  border: 2px solid var(--color-input-border);
  cursor: pointer;
  color: var(--color-text-heading);
  position: absolute;
  top: 90px;
  left: 24px;
  box-shadow: var(--shadow-back-btn);          /* hard shadow, zero blur */
  transform: translateY(0);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.back-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 #C4AC7A;
}
```

---

## 5. Component Specifications

### 5.1 Navigation Bar

```css
.navbar {
  width: 100%;
  height: 70px;
  background: var(--color-nav-bg);
  border-bottom: 1px solid var(--color-nav-border);
  display: flex;
  align-items: center;
  padding: 0 var(--space-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.navbar-logo-img {
  height: 48px;
  width: auto;
}

.navbar-logo-text {
  font-family: 'Sparky Stones', cursive;
  font-weight: normal;
  font-size: 1.75rem;
  color: var(--color-primary);
  letter-spacing: 0.02em;
  /* The "SANDBOX" wordmark uses Sparky Stones matching the bubbly kawaii brand identity */
}
```

### 5.2 Input Fields

All inputs share the same base style across all screens.

```css
.input-field {
  width: 100%;
  height: 52px;
  background: var(--color-input-bg);
  border: 2px solid var(--color-input-border);
  border-radius: 16px;
  padding: 0 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-body);
  outline: none;
  box-shadow: var(--shadow-input);             /* hard shadow, zero blur — static, never collapses */
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: var(--color-text-placeholder);
  font-weight: 400;
}

/* Focus: border highlights, shadow stays — inputs don't press like buttons */
.input-field:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-input);             /* shadow stays the same on focus */
  outline: none;
}
```

#### Input with Inline Action (FORGOT?, GENERATE)

```css
.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper .input-field {
  padding-right: 100px; /* space for inline label */
}

.input-inline-action {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-text-placeholder);
  cursor: pointer;
  text-transform: uppercase;
  user-select: none;
}

.input-inline-action:hover {
  color: var(--color-primary);
}
```

#### Input with Icon (Birthdate calendar icon)

```css
.input-icon-right {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-placeholder);
  pointer-events: none;
}
```

#### Select / Dropdown (Affiliation)

```css
.select-field {
  /* Same base as input-field */
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron-down icon */
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 44px;
  cursor: pointer;
}
```

### 5.3 Buttons

#### Primary Button (Solid Coral)

Used for: LOG IN, GET STARTED, SEND CODE TO EMAIL, CONFIRM CODE, SET NEW PASSWORD, PROCEED TO LOGIN, CREATE SHELL (final step)

```css
.btn-primary {
  width: 100%;
  height: 54px;
  background: var(--color-primary);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--shadow-btn-primary);       /* hard shadow, zero blur */
  transform: translateY(0);
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
}

.btn-primary:hover {
  background: #D96347;
}

/* Duolingo press mechanic: element moves down, shadow collapses */
.btn-primary:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 0 #A04035;
}
```

#### Secondary Button (Outlined Sandy Yellow)

Used for: "I ALREADY HAVE A SHELL"

This button follows the **unfilled → filled** pattern. Since it is a static navigation button (not gated by form input), it renders in its filled/active state by default.

```css
.btn-secondary {
  width: 100%;
  height: 54px;
  background: transparent;
  color: #B89A3A;                              /* sandy active text color */
  border: 2.5px solid var(--color-secondary-border);
  border-radius: 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--shadow-btn-secondary);     /* hard shadow even on outlined state */
  transform: translateY(0);
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease, color 0.15s ease;
}

.btn-secondary:hover {
  background: rgba(232, 201, 122, 0.15);
}

/* Duolingo press mechanic */
.btn-secondary:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 0 #B89A3A;
}
```

#### Progress/Split Button (NEXT STEP — multi-step form)

The "NEXT STEP" button shows a split-style visual indicating progress through the multi-step form. The left portion is the lighter coral (completed steps), the right portion is the darker brown-coral (remaining steps).

```css
.btn-progress {
  width: 100%;
  height: 54px;
  position: relative;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-btn-primary);       /* hard shadow, zero blur */
  transform: translateY(0);
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn-progress:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 0 #A04035;
}

/* Step 1 of 3 → 33% filled */
/* Step 2 of 3 → 66% filled */
/* Controlled via CSS custom property --progress */
.btn-progress::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: var(--progress, 33%);
  background: var(--color-primary);
  transition: width 0.4s ease;
}

.btn-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: var(--progress, 33%);
  right: 0;
  height: 100%;
  background: var(--color-primary-dark);
}

.btn-progress span {
  position: relative;
  z-index: 1;
}

/* Usage: style="--progress: 33%" for step 1, --progress: 66% for step 2, etc. */
```

#### Disabled Button (Complete Requirements — password incomplete)

```css
.btn-disabled {
  width: 100%;
  height: 54px;
  background: var(--color-input-bg);
  color: var(--color-text-placeholder);
  border: 2px solid var(--color-input-border);
  border-radius: 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: not-allowed;
  pointer-events: none;
  /* No shadow — visually flat and inert */
}
```

---

#### 5.3.1 Form-Gated Button States (Unfilled → Filled)

When a CTA button is gated by required form input (e.g., LOG IN, NEXT STEP, SEND CODE TO EMAIL, CONFIRM CODE, SET NEW PASSWORD), the button has **two distinct visual states** that transition based on whether the required fields are populated:

**Unfilled State (fields empty):**
- Background: `transparent`
- Border: `2.5px solid var(--color-primary)` (coral) or relevant button color
- Text color: `var(--color-primary)` (matches border)
- Box-shadow: `none` — no hard shadow while unfilled
- Cursor: `default` or `not-allowed`
- `pointer-events: none` (not clickable until fields are filled)

**Filled State (all required fields have content):**
- Background: `var(--color-primary)` (solid filled coral)
- Border: `none`
- Text color: `#FFFFFF`
- Box-shadow: `var(--shadow-btn-primary)` (hard shadow returns)
- Cursor: `pointer`
- `pointer-events: auto` (now clickable)

```css
/* BASE — Unfilled (default when fields are empty) */
.btn-form-gated {
  width: 100%;
  height: 54px;
  background: transparent;
  color: var(--color-primary);
  border: 2.5px solid var(--color-primary);
  border-radius: 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: default;
  pointer-events: none;
  box-shadow: none;
  transform: translateY(0);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.15s ease;
}

/* FILLED — all required fields have content */
.btn-form-gated.is-filled {
  background: var(--color-primary);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: var(--shadow-btn-primary);       /* hard shadow appears */
}

/* Press mechanic — only active in filled state */
.btn-form-gated.is-filled:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 0 #A04035;
}
```

**JavaScript — toggle `.is-filled` based on field validation:**

```javascript
const fields = document.querySelectorAll('.required-field');
const btn = document.querySelector('.btn-form-gated');

function checkFields() {
  const allFilled = [...fields].every(f => f.value.trim() !== '');
  btn.classList.toggle('is-filled', allFilled);
}

fields.forEach(f => f.addEventListener('input', checkFields));
```

**Which buttons use this pattern:**

| Button Label | Screen | Required Fields |
|---|---|---|
| LOG IN | Log In | Email/username + Password |
| NEXT STEP (Step 1) | Sign Up — Step 1 | Last Name, First Name, Email, Password, Confirm Password |
| NEXT STEP (Step 2) | Sign Up — Step 2 | Username |
| CREATE SHELL (Step 3) | Sign Up — Step 3 | Birthdate, Contact Number, Affiliation |
| CREATE SHELL (Step 4) | Verify your Hermit | Code |
| SEND CODE TO EMAIL | Forgot Password — Step 1 | Email |
| CONFIRM CODE | Forgot Password — Step 2 | Email + Code |
| SET NEW PASSWORD | Forgot Password — Step 3 | New Password + Confirm (all requirements met) |

> **Note:** "GET STARTED" and "I ALREADY HAVE A SHELL" on the Landing page are **always active** — they are not gated by any input fields, so they always render in their filled/active state.

### 5.4 Error Banner

```css
.error-banner {
  width: 100%;
  background: var(--color-error-bg);
  border-radius: 16px;
  padding: 20px 24px;
  text-align: center;
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-error-banner);      /* hard shadow, zero blur */
}

.error-banner p {
  font-family: 'Montley Forces', cursive;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-error-text);
  line-height: 1.4;
  margin: 0;
  letter-spacing: 0.02em;
}
```

### 5.5 Password Requirements Box

```css
.password-requirements {
  width: 100%;
  background: var(--color-input-bg);
  border: 2px solid var(--color-input-border);
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: var(--shadow-card);              /* hard shadow, zero blur */
}

.password-requirements-title {
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-placeholder);
  margin-bottom: 8px;
}

.password-requirements ul {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.password-requirements li {
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-placeholder); /* default unmet */
  transition: color 0.2s ease;
}

.password-requirements li.met {
  color: var(--color-success);
}
```

### 5.6 Resend Code Countdown

```css
.resend-countdown {
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-placeholder);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 8px;
  padding-left: 4px;
}
```

### 5.7 Success / Confirmation Screen

Used for "Your Hermit has been created!" and "New Password Set!" screens.

```css
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  gap: var(--space-xl);
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
}

/* The "Your Hermit has been created" layout is side-by-side on desktop */
.success-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xl);
}

.success-heading {
  font-family: 'Montley Forces', cursive;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-heading);
  line-height: 1.2;
}

/* The mascot image overlaps the CTA button at the bottom */
.success-mascot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-mascot img {
  width: 220px;
  height: auto;
  z-index: 1;
  position: relative;
}

.success-mascot .btn-primary {
  width: 240px;
  margin-top: -20px; /* slight overlap with mascot */
  border-radius: 0 0 16px 16px;
}
```

### 5.8 Landing Page Hero

```css
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xl);
  padding: var(--space-3xl) var(--space-lg);
  max-width: 900px;
  margin: 0 auto;
}

.hero-image {
  width: 300px;
  height: auto;
  flex-shrink: 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.hero-heading {
  font-family: 'Montley Forces', cursive;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-heading);
  line-height: 1.25;
  text-align: center;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 280px;
}

.hero-link {
  font-size: 0.8rem;
  color: var(--color-text-link);
  text-decoration: underline;
  text-align: center;
  cursor: pointer;
  font-style: italic;
}
```

---

## 6. Form Patterns

### Multi-Step Sign Up Form

The sign-up flow is a 3-step wizard. The "NEXT STEP" button acts as a visual progress indicator.

| Step | Screen Title | Fields | Button Progress |
|---|---|---|---|
| Step 1 | Create your Hermit | Last Name, First Name, Email, Password, Confirm Password | 1/3 (~33%) |
| Step 2 | Create your Hermit | Username (with GENERATE) | 2/3 (~66%) |
| Step 3 | Create your Hermit | Birthdate, Contact Number, Affiliation | Final → "CREATE SHELL" (full coral, no split) |
| Step 4 | Verify your Hermit | Code | "CREATE SHELL" (solid) |
| Step 5 | (Success) | — | "PROCEED TO LOGIN" |

### Name Fields (Side-by-side)

```css
.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}
```

### Forgot Password Flow

| Step | Screen | Fields | Button |
|---|---|---|---|
| Step 1 | Forgot Password | Email, Code | SEND CODE TO EMAIL |
| Step 2 (fail) | Forgot Password | Email, Code + error banner + countdown | CONFIRM CODE |
| Step 2 (success) | Forgot Password | Email, Code + countdown | CONFIRM CODE |
| Step 3 | Forgot Password | New Password, Confirm New Password + requirements (disabled btn) | Complete Requirements (disabled) → SET NEW PASSWORD (active) |
| Step 4 | (Success) | — | PROCEED TO LOGIN |

---

## 7. Border Radius System

All interactive elements use heavily rounded corners to match the soft kawaii aesthetic.

```css
:root {
  --radius-sm:    8px;   /* Minor elements */
  --radius-md:    12px;  /* Back button */
  --radius-lg:    16px;  /* Inputs, buttons, cards, banners */
  --radius-xl:    20px;  /* Large modal cards (if any) */
  --radius-full:  9999px; /* Pill shapes */
}
```

---

## 8. Shadow System

### Philosophy — Duolingo-Style Hard Shadows

This app uses **hard/flat shadows with zero blur** — the same technique Duolingo uses on all its buttons, cards, and interactive containers. This gives every element a tactile, sticker-like 3D appearance without soft/gaussian blurring.

**The rule:** `box-shadow: 0 [offset]px 0 0 [darker-shade-of-element-color]`
- `blur-radius` is always `0` — never use a soft/feathered shadow
- `spread` is always `0`
- The shadow color is always a **darker, fully opaque shade** of the element's own background color — never `rgba` with opacity, never black

```
✅ CORRECT:   box-shadow: 0 5px 0 0 #A04035;        (hard, opaque, color-matched)
❌ WRONG:     box-shadow: 0 4px 8px rgba(0,0,0,0.15); (soft, blurred, generic black)
❌ WRONG:     box-shadow: 0 4px 0 rgba(0,0,0,0.12);   (opaque-ish but wrong color)
```

### The Press Mechanic (Duolingo Button Behavior)

When a button is pressed (`:active`), it should feel physically pushed down:

```
Resting:  element sits at normal Y, shadow offset = 5px below → looks raised
Active:   element moves DOWN by the shadow offset (translateY(+5px)), shadow = 0 → looks pressed flat
```

```css
/* Resting state */
.btn-primary {
  transform: translateY(0);
  box-shadow: 0 5px 0 0 #A04035;
}

/* Pressed state */
.btn-primary:active {
  transform: translateY(5px);   /* moves down by exact shadow offset */
  box-shadow: 0 0 0 0 #A04035;  /* shadow collapses to zero */
}
```

### Shadow Token Reference

```css
:root {
  /* Hard shadows — zero blur, zero spread, opaque darker shade */
  --shadow-btn-primary:   0 5px 0 0 #A04035;   /* coral button → dark coral underside */
  --shadow-btn-secondary: 0 5px 0 0 #B89A3A;   /* sandy button → darker sandy underside */
  --shadow-input:         0 4px 0 0 #C4AC7A;   /* input fields → warm tan underside */
  --shadow-card:          0 5px 0 0 #C8B88A;   /* cards/containers → warm tan underside */
  --shadow-error-banner:  0 5px 0 0 #D07070;   /* error banner → deeper pink underside */
  --shadow-back-btn:      0 4px 0 0 #C4AC7A;   /* back button → warm tan underside */
}
```

### Per-Element Shadow Application

| Element | Shadow Token | Notes |
|---|---|---|
| Primary button (filled coral) | `--shadow-btn-primary` | Always present; collapses on `:active` |
| Secondary button (sandy outline, filled) | `--shadow-btn-secondary` | Same mechanic |
| Input fields | `--shadow-input` | Static — does NOT press/collapse |
| Back button | `--shadow-back-btn` | Collapses on `:active` like a button |
| Error banner | `--shadow-error-banner` | Static — decorative depth only |
| Password requirements box | `--shadow-card` | Static — card-like depth |
| Progress/split button | `--shadow-btn-primary` | Collapses on `:active` |
| Disabled button | none | No shadow — visually flat and inert |

---

## 9. Icon Style

- **Style:** Line icons, ~20–24px, stroke-based (not filled), rounded stroke caps
- **Color:** `var(--color-text-placeholder)` by default; `var(--color-primary)` on focus/active
- **Icons used:**
  - `←` arrow in back button
  - Calendar icon in Birthdate field
  - Chevron-down `⌄` in Affiliation dropdown
- Recommended library: **Lucide Icons** or **Heroicons** (outline variant)

---

## 10. Motion & Interaction Guidelines

### Transitions

```css
/* Global transition base */
*, *::before, *::after {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Standard UI transitions */
--transition-fast:   0.15s;
--transition-base:   0.2s;
--transition-slow:   0.4s;
```

### Interaction Behaviors

- **Button press:** `translateY(5px)` + `box-shadow` collapses to `0 0 0 0` on `:active` (Duolingo mechanic)
- **Button hover:** background darkens slightly — no translateY on hover, only on press
- **Input focus:** border color changes to `--color-primary`; hard shadow stays unchanged
- **Password requirements:** each item transitions from grey → green as the user types
- **Progress button:** `--progress` width animates with `transition: width 0.4s ease`
- **Error banner:** slides in from top with `animation: slideDown 0.3s ease`
- **Countdown timer:** text updates every second (JS interval), no animation needed
- **Button unfilled → filled:** see Section 5.3 — Button States (Form-Gated)

### Suggested Keyframes

```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.error-banner {
  animation: slideDown 0.3s ease;
}
```

---

## 11. Responsive Breakpoints

```css
/* Mobile-first approach */
/* Mobile: default (375px+) */
/* Tablet: 768px+ */
/* Desktop: 1024px+ */

@media (min-width: 768px) {
  .hero {
    flex-direction: row;
    justify-content: center;
  }

  .hero-heading {
    text-align: left;
  }
}

@media (max-width: 767px) {
  .hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-image {
    width: 200px;
  }

  .name-row {
    grid-template-columns: 1fr;
  }

  .success-content {
    flex-direction: column;
  }
}
```

---

## 12. Footer Disclaimer Text

Appears at the bottom of every auth page.

```css
.auth-footer {
  margin-top: var(--space-2xl);
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-body);
  opacity: 0.75;
  line-height: 1.5;
}

.auth-footer a {
  color: var(--color-text-link);
  text-decoration: underline;
  font-weight: 600;
}
```

**Text template:**
> By signing in to Sandbox, you agree to our [Terms] and [Privacy Policy].

---

## 13. Accessibility Notes

- All interactive elements must have `min-height: 44px` (touch target)
- Error states: use both color AND text (not color alone) for accessibility
- Password fields: include a show/hide toggle (eye icon)
- All inputs must have `aria-label` or associated `<label>` elements
- Focus ring: never remove outline entirely — use `box-shadow` focus ring instead
- Color contrast: `#4A3F35` on `#FAF0DC` passes WCAG AA for normal text

---

## 14. File/Asset Naming Conventions

Based on the mockups, the following assets are expected:

```
/assets/
  images/
    logo-hermit.png          ← Hermit crab mascot (nav bar icon)
    mascot-full.png          ← Full hermit crab mascot (landing hero, success screen)
    mascot-shell-only.png    ← Just the shell (confirmation screen variant)
  icons/
    arrow-left.svg
    calendar.svg
    chevron-down.svg
```

---

## 15. Quick Reference Cheatsheet

```
BACKGROUND:      #FAF0DC  (warm cream)
PRIMARY BUTTON:  #E8735A  (coral salmon)
BUTTON DARK:     #A04035  (dark coral — hard shadow color for primary btn)
INPUT BG:        #F2E4BF  (light sandy)
INPUT BORDER:    #D4BC8A  (warm tan)
TEXT:            #4A3F35  (dark brown-gray)
PLACEHOLDER:     #B09A78  (muted tan)
ERROR BG:        #F4A0A0  (soft pink-red)
SUCCESS TEXT:    #4CAF50  (leaf green)
LINK:            #7A8FA6  (muted blue-gray)

BORDER RADIUS:   16px (inputs, buttons), 12px (back btn)
FONT BRAND:      Sparky Stones (logo/wordmark only)
FONT HEADING:    Montley Forces (page titles, section headers)
FONT BODY/UI:    Roboto 400/500/700 (everything else)
FONT BUTTON:     Roboto 700, UPPERCASE

SHADOW STYLE:    Hard/flat, ZERO blur — 0 5px 0 0 [darker-shade]  ← Duolingo style
SHADOW BTN:      0 5px 0 0 #A04035  (coral button underside)
SHADOW INPUT:    0 4px 0 0 #C4AC7A  (tan input underside, static)
SHADOW CARD:     0 5px 0 0 #C8B88A  (card/container underside, static)
NEVER USE:       blur, rgba opacity, or black for shadows

BUTTON PRESS:    translateY(+5px) + box-shadow collapses to 0 on :active
BUTTON UNFILLED: transparent bg, colored border+text, no shadow, not clickable
BUTTON FILLED:   solid bg, white text, hard shadow, clickable
```

---

*End of SANDBOX Master Styling Guide — v1.0*  
*Generated from analysis of: Landing.png, Log_in.png, Sign_Up_-_1 through 5.png, Forgot_Password_-_1 through 5.png*
