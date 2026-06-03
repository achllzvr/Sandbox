# Design System Migration Guide

This guide explains how to migrate existing Blade components to the new React component system.

## Overview

The Sandbox app has been using Blade components (server-side) and some legacy Inertia components. The new design system provides modern React components that are:
- More performant
- Better type-safe
- Consistent with UI design
- Ready for single-page application patterns

## Existing Components to Migrate

### Blade Components (Legacy)
Located in `resources/views/components/`

- `button.blade.php` → Use `Button.jsx`
- `card.blade.php` → Use `Card.jsx`
- `input.blade.php` → Use `Input.jsx`
- `footer.blade.php` → Create React version
- `navbar.blade.php` → Create React version

### Inertia/React Components (Partial)
Located in `resources/js/Components/`

**OLD Components** (to be phased out):
- `Checkbox.jsx` (legacy)
- `InputError.jsx` (replaced by Input error prop)
- `InputLabel.jsx` (replaced by Input label prop)
- `PrimaryButton.jsx` (replaced by Button)
- `TextInput.jsx` (replaced by Input)

**NEW Components** (to use instead):
- `Button.jsx` - All button needs
- `Input.jsx` - All text input needs
- `Checkbox.jsx` (improved version)
- `Select.jsx` - New component
- `Card.jsx` - Structured containers

## Migration Steps

### Step 1: Update Login Page

**BEFORE** (using old components):
```jsx
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login() {
  return (
    <>
      <InputLabel htmlFor="email" value="Email" />
      <TextInput
        id="email"
        type="email"
        name="email"
      />
      <PrimaryButton>Log in</PrimaryButton>
    </>
  );
}
```

**AFTER** (using new components):
```jsx
import { Input, Button, Card, Layout } from '@/Components';

export default function Login() {
  return (
    <Layout type="centered">
      <Card variant="elevated">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
        />
        <Button variant="primary">Log in</Button>
      </Card>
    </Layout>
  );
}
```

### Step 2: Update Register Page

**OLD PATTERN**:
- Multiple input components
- Separate error display
- No validation helpers

**NEW PATTERN**:
- Single Input component with built-in label + error
- MultiStepForm for registration flow
- Built-in validators from `formUtils`

### Step 3: Update Form Pages

For any page with forms:

1. Replace input components with `Input`
2. Replace select inputs with `Select`
3. Replace buttons with `Button`
4. Replace error displays with `error` prop on inputs
5. Use `validators` for form validation
6. Wrap content in `Card` for consistency

## Component Migration Checklists

### ☐ Login Page
- [ ] Replace with new Layout wrapper
- [ ] Use new Input component
- [ ] Use new Button component  
- [ ] Add form validation
- [ ] Style with Card

### ☐ Register Page
- [ ] Replace with MultiStepForm
- [ ] Use Input for all fields
- [ ] Use Select for dropdowns
- [ ] Add PasswordRequirements
- [ ] Add email verification OTP flow

### ☐ Forgot Password Page
- [ ] Use MultiStepForm (3 steps)
- [ ] Add OTPInput for code
- [ ] Add CountdownTimer
- [ ] Add PasswordRequirements

### ☐ Admin Pages
- [ ] Replace form components
- [ ] Use Card for page sections
- [ ] Add Alert for notifications
- [ ] Use FileUpload for uploads

### ☐ Dashboard Pages
- [ ] Use MainLayout wrapper
- [ ] Replace cards with Card component
- [ ] Add consistent spacing
- [ ] Use Button for actions

### ☐ Email Verification
- [ ] Add OTPInput
- [ ] Add CountdownTimer
- [ ] Add validation flow

## Breaking Changes

### Input Component

**OLD**:
```jsx
<TextInput
  id="email"
  type="email"
  name="email"
  className="mt-1 block w-full"
  onChange={handleChange}
/>
<InputError message={errors.email} />
```

**NEW**:
```jsx
<Input
  type="email"
  name="email"
  label="Email"
  error={errors.email}
  onChange={handleChange}
/>
```

### Button Component

**OLD**:
```jsx
<PrimaryButton disabled={processing}>
  Log in
</PrimaryButton>
```

**NEW**:
```jsx
<Button variant="primary" isLoading={processing}>
  Log in
</Button>
```

### Labels

**OLD** (separate component):
```jsx
<InputLabel htmlFor="email" value="Email" />
<TextInput id="email" />
```

**NEW** (built-in):
```jsx
<Input label="Email" />
```

## Color Scheme Updates

### Update Any Hardcoded Colors

**BEFORE**:
```jsx
<div style={{ color: '#333', backgroundColor: '#f0f0f0' }}>
```

**AFTER**:
```jsx
import { colors } from '@/Styles/theme';

<div style={{ 
  color: colors.text.primary, 
  backgroundColor: colors.bg.light 
}}>
```

## Spacing Updates

**BEFORE** (arbitrary values):
```jsx
<div style={{ padding: '20px', gap: '10px' }}>
```

**AFTER** (design tokens):
```jsx
import { spacing } from '@/Styles/theme';

<div style={{ 
  padding: spacing.xl, 
  gap: spacing.sm 
}}>
```

## Form Validation Updates

**BEFORE**:
```jsx
// Manual validation
if (!email.includes('@')) {
  setErrors({ email: 'Invalid email' });
}
```

**AFTER**:
```jsx
import { validators } from '@/Utils/formUtils';

const error = validators.email(email);
if (error) {
  setErrors({ email: error });
}
```

## File Organization After Migration

```
resources/js/
├── Components/
│   ├── index.js (new exports)
│   ├── Button.jsx (new)
│   ├── Input.jsx (new)
│   ├── Select.jsx (new)
│   ├── Card.jsx (new)
│   ├── Alert.jsx (new)
│   ├── OTPInput.jsx (new)
│   ├── PasswordRequirements.jsx (new)
│   ├── MultiStepForm.jsx (new)
│   ├── Checkbox.jsx (new/updated)
│   ├── Modal.jsx (existing)
│   ├── [DEPRECATED] TextInput.jsx
│   ├── [DEPRECATED] InputLabel.jsx
│   ├── [DEPRECATED] InputError.jsx
│   ├── [DEPRECATED] PrimaryButton.jsx
│   └── [DEPRECATED] Checkbox.jsx (old version)
├── Layouts/
│   ├── MainLayout.jsx (new)
│   ├── GuestLayout.jsx (existing)
│   └── DashboardLayout.jsx (existing)
├── Pages/
│   ├── Auth/
│   │   ├── Login.jsx (to update)
│   │   ├── Register.jsx (to update)
│   │   ├── ForgotPassword.jsx (to update)
│   │   └── ...
│   ├── Dashboard/
│   │   ├── Learner/ (to create)
│   │   ├── Admin/ (to update)
│   │   └── Staff/ (to update)
│   └── ...
├── Styles/
│   └── theme.js (new)
└── Utils/
    └── formUtils.js (new)
```

## Testing Checklist

After migration of each page:

- [ ] All inputs display correctly
- [ ] Validation works on blur/submit
- [ ] Error messages display
- [ ] Loading states work
- [ ] Buttons are clickable
- [ ] Colors match design
- [ ] Spacing is consistent
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Forms can be submitted

## Deprecation Timeline

### Immediate (Available Now)
- New components: Button, Input, Select, Card, Alert, etc.
- Use these for new pages/features

### Phase 1 (Week 1)
- Migrate auth pages (Login, Register, ForgotPassword)
- Migrate form pages
- Migrate user dashboard

### Phase 2 (Week 2)
- Migrate admin pages
- Migrate staff pages
- Update tables/lists if applicable

### Phase 3 (Week 3)
- Remove old components
- Clean up deprecated imports
- Update tests

### Removal (End of Phase 3)
- Delete deprecated components:
  - TextInput.jsx
  - InputLabel.jsx
  - InputError.jsx
  - PrimaryButton.jsx
  - Old Checkbox.jsx

## Support for Legacy Code

**During transition**, you can use both old and new components:

```jsx
// MIX OLD AND NEW - OK DURING MIGRATION
import { Button } from '@/Components';        // new
import PrimaryButton from '@/Components/PrimaryButton'; // old
```

**But avoid mixing them in the same form**:

```jsx
// BAD - Inconsistent styling
<Input label="Email" />        {/* new style */}
<TextInput id="password" />    {/* old style */}

// GOOD - Consistent
<Input label="Email" />
<Input label="Password" type="password" />
```

## Questions?

Refer to:
1. `COMPONENT_LIBRARY.md` - Complete API docs
2. `QUICK_START.md` - Quick examples
3. Component source files - Implementation details
4. `resources/js/Utils/formUtils.js` - Validators
5. `resources/js/Styles/theme.js` - Design tokens
