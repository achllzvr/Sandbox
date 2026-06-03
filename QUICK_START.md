# Design System - Quick Start Guide

## Installation

Nothing to install! All components are built into the project.

## Import Components

```jsx
// Import specific components
import { Button, Input, Card } from '@/Components';

// Import theme tokens
import { colors, spacing } from '@/Styles/theme';

// Import validators
import { validators } from '@/Utils/formUtils';
```

## 5-Minute Examples

### 1. Basic Form

```jsx
import { Input, Button } from '@/Components';
import { useState } from 'react';

export function SignupForm() {
  const [email, setEmail] = useState('');

  return (
    <form>
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="primary">Sign Up</Button>
    </form>
  );
}
```

### 2. With Validation

```jsx
import { Input, Alert, Button } from '@/Components';
import { validators } from '@/Utils/formUtils';
import { useState } from 'react';

export function ValidatedForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validators.email(email);
    setError(err);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} />}
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### 3. Multi-Step Form

```jsx
import { MultiStepForm, Input } from '@/Components';

const steps = [
  { title: 'Name', description: 'What is your name?' },
  { title: 'Email', description: 'What is your email?' },
];

export function SignupWizard() {
  return (
    <MultiStepForm
      steps={steps}
      onSubmit={() => console.log('Done!')}
    >
      {(step) => (
        <>
          {step === 0 && <Input label="Name" />}
          {step === 1 && <Input label="Email" />}
        </>
      )}
    </MultiStepForm>
  );
}
```

### 4. Using Colors

```jsx
import { colors } from '@/Styles/theme';

export function ThemedCard() {
  return (
    <div
      style={{
        backgroundColor: colors.bg.light,
        padding: '1rem',
        border: `1px solid ${colors.border.light}`,
        borderRadius: '8px',
        color: colors.text.primary,
      }}
    >
      Styled with design tokens!
    </div>
  );
}
```

### 5. Loading State

```jsx
import { Button } from '@/Components';
import { useState } from 'react';

export function LoadingButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Do something...
    setLoading(false);
  };

  return (
    <Button isLoading={loading} onClick={handleClick}>
      Submit
    </Button>
  );
}
```

## Common Patterns

### Form with Multiple Fields

```jsx
import { Input, Button, Card, Alert } from '@/Components';
import { useState } from 'react';

export function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate...
    // Submit...
  };

  return (
    <Card variant="elevated">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Button type="submit">Login</Button>
      </form>
    </Card>
  );
}
```

### OTP Verification

```jsx
import { OTPInput, CountdownTimer, Button } from '@/Components';
import { useState } from 'react';

export function VerifyOTP() {
  const [code, setCode] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <OTPInput length={6} value={code} onChange={setCode} />
      <CountdownTimer onResend={() => console.log('Resend')} />
      <Button onClick={() => console.log('Verify:', code)}>
        Verify Code
      </Button>
    </div>
  );
}
```

## Component Props Reference

### Button
```jsx
<Button
  variant="primary"      // 'primary' | 'secondary' | 'ghost' | 'danger'
  size="md"              // 'sm' | 'md' | 'lg'
  isLoading={false}      // boolean
  disabled={false}       // boolean
  onClick={() => {}}     // function
  className=""           // string
>
  Click me
</Button>
```

### Input
```jsx
<Input
  type="text"            // 'text' | 'email' | 'password' | 'number' | 'date'
  label="Field"          // string
  placeholder="..."      // string
  value=""               // string
  onChange={() => {}}    // function
  error=""               // string
  disabled={false}       // boolean
  required={true}        // boolean
/>
```

### Select
```jsx
<Select
  label="Choose"         // string
  options={[             // Array<{value, label}>
    { value: '1', label: 'Option 1' }
  ]}
  value=""               // string
  onChange={() => {}}    // function
  error=""               // string
/>
```

### Card
```jsx
<Card
  variant="elevated"     // 'default' | 'elevated' | 'outlined'
  centered={false}       // boolean
>
  Content
</Card>
```

### Alert
```jsx
<Alert
  type="error"           // 'error' | 'success' | 'warning' | 'info'
  title="Title"          // string
  message="Message"      // string
  dismissible={true}     // boolean
  onClose={() => {}}     // function
/>
```

## Validators Quick Reference

```jsx
import { validators } from '@/Utils/formUtils';

validators.email(value)                    // Email format check
validators.password(value)                 // Strong password check
validators.confirmPassword(pwd, confirm)   // Password match
validators.required(value)                 // Not empty
validators.phone(value)                    // Phone format
validators.url(value)                      // URL format
validators.number(value)                   // Number format
validators.minLength(value, 8)             // Minimum length
validators.maxLength(value, 50)            // Maximum length
validators.date(value)                     // Valid date
validators.minAge(birthDate, 18)           // Minimum age
```

## Color Palette Quick Reference

```jsx
import { colors } from '@/Styles/theme';

// Backgrounds
colors.bg.primary       // #FAF4ED (cream)
colors.bg.secondary     // #F5E6D3 (beige)
colors.bg.light         // #FFFAF5 (off-white)

// Primary actions
colors.button.primary   // #ED8680 (coral red)
colors.button.secondary // #A0725A (rustic brown)

// Text
colors.text.primary     // #2C3E50 (dark)
colors.text.secondary   // #5F6B7A (medium)
colors.text.light       // #8B9BA8 (light)

// Status
colors.status.success   // #6BBF8E (green)
colors.status.error     // #ED7B77 (red)
colors.status.warning   // #F5B95F (orange)
colors.status.info      // #6B9FBF (blue)
```

## Spacing Quick Reference

```jsx
import { spacing } from '@/Styles/theme';

spacing.xs      // 0.25rem (4px)
spacing.sm      // 0.5rem (8px)
spacing.md      // 1rem (16px)
spacing.lg      // 1.5rem (24px)
spacing.xl      // 2rem (32px)
spacing['2xl']  // 2.5rem (40px)
spacing['3xl']  // 3rem (48px)
spacing['4xl']  // 4rem (64px)
```

## Tips & Tricks

1. **Clear errors on input**: User errors automatically clear when they start typing
2. **Auto-focus**: Use `ref` for manual focus control
3. **Loading states**: Always set `isLoading` during async operations
4. **Keyboard support**: All components support keyboard navigation
5. **Mobile friendly**: All components are touch-optimized
6. **Responsive**: Use Tailwind classes like `flex-col gap-4` for layouts

## Documentation Links

- Full docs: See `COMPONENT_LIBRARY.md`
- Source code: `resources/js/Components/`
- Theme tokens: `resources/js/Styles/theme.js`
- Validators: `resources/js/Utils/formUtils.js`

## Need Help?

1. Check the component source files for prop details
2. Review examples in `COMPONENT_LIBRARY.md`
3. Check the validators in `formUtils.js`
4. Use browser DevTools to inspect styled components
