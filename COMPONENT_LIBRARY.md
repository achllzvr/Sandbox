# Sandbox Design System & Component Library

Complete component library and design tokens for the Sandbox application.

## Quick Start

### Import Components

```jsx
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  Alert 
} from '@/Components';
import { colors } from '@/Styles/theme';
```

### Use a Component

```jsx
import { Button } from '@/Components';

function MyComponent() {
  return (
    <Button 
      variant="primary" 
      size="md"
      onClick={() => alert('Clicked!')}
    >
      Click Me
    </Button>
  );
}
```

---

## Design Tokens

All design tokens are defined in `/resources/js/Styles/theme.js`

### Colors

```javascript
const colors = {
  bg: {
    primary: '#FAF4ED',    // Warm cream
    secondary: '#F5E6D3',  // Softer beige
    light: '#FFFAF5',      // Off-white
    dark: '#2C3E50',       // Dark charcoal
  },
  button: {
    primary: '#ED8680',    // Coral red (main CTA)
    primaryDark: '#D97269',
    primaryLight: '#F5A5A1',
    secondary: '#A0725A',  // Rustic brown
  },
  text: {
    primary: '#2C3E50',    // Main text
    secondary: '#5F6B7A',  // Secondary text
    light: '#8B9BA8',      // Light text
  },
  status: {
    success: '#6BBF8E',    // Green
    error: '#ED7B77',      // Red
    warning: '#F5B95F',    // Orange
    info: '#6B9FBF',       // Blue
  },
};
```

### Spacing Scale

```javascript
xs: '0.25rem'    // 4px
sm: '0.5rem'     // 8px
md: '1rem'       // 16px
lg: '1.5rem'     // 24px
xl: '2rem'       // 32px
2xl: '2.5rem'    // 40px
3xl: '3rem'      // 48px
4xl: '4rem'      // 64px
```

### Typography

- **Font Family**: System stack (San Francisco, Segoe UI, Roboto)
- **Sizes**: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`
- **Weights**: `normal` (400), `medium` (500), `semibold` (600), `bold` (700)
- **Line Height**: `tight` (1.2), `normal` (1.5), `relaxed` (1.75)

### Border Radius

```javascript
none: '0'
sm: '0.25rem'    // 4px
md: '0.375rem'   // 6px
lg: '0.5rem'     // 8px
full: '9999px'
```

### Shadows

- `sm`: Light shadow for subtle depth
- `md`: Standard shadow for cards
- `lg`: Elevated shadow for dropdowns/modals
- `xl`: Heavy shadow for overlays

---

## Components

### Button

Primary action component with multiple variants.

**Props:**
- `variant`: `'primary'` | `'secondary'` | `'ghost'` | `'danger'` (default: `'primary'`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `isLoading`: `boolean` - Shows loading spinner
- `disabled`: `boolean`
- `onClick`: `function`
- `children`: `ReactNode`

**Example:**
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Create Account
</Button>

<Button variant="ghost" disabled>
  Disabled Button
</Button>

<Button isLoading={isLoading}>
  Processing...
</Button>
```

---

### Input

Text input field with validation support.

**Props:**
- `type`: `'text'` | `'email'` | `'password'` | `'number'` | `'date'` (default: `'text'`)
- `label`: `string` - Label text
- `placeholder`: `string`
- `error`: `string` - Error message to display
- `value`: `string`
- `onChange`: `function`
- `disabled`: `boolean`
- `required`: `boolean`

**Example:**
```jsx
<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>
```

---

### Select

Dropdown select component.

**Props:**
- `label`: `string`
- `options`: `Array<{value, label}>` - Dropdown options
- `value`: `string` - Selected value
- `onChange`: `function`
- `placeholder`: `string` (default: `'Select an option...'`)
- `error`: `string`
- `disabled`: `boolean`
- `required`: `boolean`

**Example:**
```jsx
<Select
  label="Affiliation"
  options={[
    { value: 'student', label: 'Student' },
    { value: 'educator', label: 'Educator' },
    { value: 'professional', label: 'Professional' },
  ]}
  value={affiliation}
  onChange={(e) => setAffiliation(e.target.value)}
  required
/>
```

---

### Card

Container component for grouping content.

**Props:**
- `variant`: `'default'` | `'elevated'` | `'outlined'` (default: `'default'`)
- `centered`: `boolean` - Center align content
- `children`: `ReactNode`

**Example:**
```jsx
<Card variant="elevated">
  <h2>My Card</h2>
  <p>Card content goes here</p>
</Card>
```

---

### Alert

Display alert messages with different types.

**Props:**
- `type`: `'error'` | `'success'` | `'warning'` | `'info'` (default: `'info'`)
- `title`: `string` - Alert title
- `message`: `string` - Alert message
- `dismissible`: `boolean` - Show close button
- `onClose`: `function` - Close handler

**Example:**
```jsx
<Alert
  type="error"
  title="Error"
  message="Something went wrong. Please try again."
  dismissible
  onClose={() => setShowAlert(false)}
/>

<Alert
  type="success"
  title="Success!"
  message="Your account has been created."
/>
```

---

### OTPInput

Multi-box OTP/verification code input.

**Props:**
- `length`: `number` - Number of code boxes (default: 6)
- `value`: `string` - Current code value
- `onChange`: `function(value)` - Called when code changes
- `label`: `string` (default: `'Verification Code'`)
- `error`: `string`
- `required`: `boolean`

**Features:**
- Auto-focus next box when digit entered
- Backspace deletes and moves to previous box
- Paste support (pastes up to length)

**Example:**
```jsx
const [code, setCode] = useState('');

<OTPInput
  length={6}
  value={code}
  onChange={setCode}
  error={error}
  label="Enter verification code"
/>
```

---

### PasswordRequirements

Visual password strength indicator.

**Props:**
- `password`: `string` - Current password
- `requirements`: `Array<{label, test}>` - Custom requirements (optional)

**Default Requirements:**
- At least 8 characters
- Uppercase letter
- Lowercase letter
- Number
- Special character

**Example:**
```jsx
const [password, setPassword] = useState('');

<PasswordRequirements password={password} />
```

---

### CountdownTimer

Countdown timer for OTP resend delays.

**Props:**
- `initialSeconds`: `number` (default: 60)
- `onResend`: `function` - Called when resend clicked
- `onComplete`: `function` - Called when countdown ends
- `autoStart`: `boolean` (default: true)

**Example:**
```jsx
<CountdownTimer
  initialSeconds={60}
  onResend={handleResendCode}
  onComplete={() => setCanResend(true)}
/>
```

---

### MultiStepForm

Multi-step form with progress indicator.

**Props:**
- `steps`: `Array<{title, description}>` - Step configuration
- `onSubmit`: `function` - Final submit handler
- `onStepChange`: `function` - Called on step change
- `showProgressBar`: `boolean` (default: true)
- `children`: `ReactNode` or `function`

**Example:**
```jsx
const steps = [
  { title: 'Basic Info', description: 'Enter your name' },
  { title: 'Email', description: 'Verify your email' },
  { title: 'Confirm', description: 'Review and confirm' },
];

<MultiStepForm
  steps={steps}
  onSubmit={(stepIndex) => handleSubmit()}
  onStepChange={(stepIndex) => console.log('Step:', stepIndex)}
>
  {(currentStep) => (
    <>
      {currentStep === 0 && <Input label="Name" />}
      {currentStep === 1 && <Input label="Email" />}
      {currentStep === 2 && <p>Ready to submit?</p>}
    </>
  )}
</MultiStepForm>
```

---

### FileUpload

File upload with drag-and-drop support.

**Props:**
- `label`: `string`
- `accept`: `string` (default: `'*'`)
- `multiple`: `boolean`
- `helpText`: `string` - Additional help text
- `error`: `string`
- `onChange`: `function(event)` - File handler
- `required`: `boolean`

**Example:**
```jsx
<FileUpload
  label="Upload Document"
  accept=".pdf,.doc,.docx"
  helpText="PDF, DOC, or DOCX (max 50MB)"
  onChange={(e) => handleFiles(e.target.files)}
  required
/>
```

---

### Other Components

- **`Textarea`**: Multi-line text input
- **`Checkbox`**: Single checkbox with label
- **`RadioGroup`**: Radio button group
- **`Layout`**: Page layout wrapper

---

## Form Utilities

### Validators

Pre-built validation functions.

```javascript
import { validators } from '@/Utils/formUtils';

// Email validation
validators.email('test@example.com')  // Returns error or empty string

// Password validation
validators.password('MyPass123!')  // Checks strength requirements

// Confirm password
validators.confirmPassword('pass', 'pass')  // Checks match

// Custom validations
validators.required(value)
validators.phone(value)
validators.url(value)
validators.minLength(value, 8)
validators.maxLength(value, 50)
validators.minAge(birthDate, 18)
```

---

## Common Patterns

### Form with Validation

```jsx
import { useState } from 'react';
import { Input, Button, Alert } from '@/Components';
import { validators } from '@/Utils/formUtils';

export function MyForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    const emailError = validators.email(values.email);
    if (emailError) newErrors.email = emailError;
    if (!values.password) newErrors.password = 'Password required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Submit
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed');
      // Success!
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        required
      />
      <Button isLoading={isLoading} type="submit">
        Submit
      </Button>
    </form>
  );
}
```

---

## Best Practices

1. **Always use design tokens** - Don't hardcode colors
2. **Validate on blur** - Clear errors as user types
3. **Show loading states** - Use button `isLoading` prop during submission
4. **Handle errors gracefully** - Display user-friendly error messages
5. **Mobile responsive** - Test forms on mobile devices
6. **Accessibility** - All inputs have labels and proper ARIA attributes
7. **Consistent spacing** - Use spacing scale for margins/padding

---

## File Structure

```
resources/js/
├── Components/
│   ├── index.js           # Export all components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Card.jsx
│   ├── Alert.jsx
│   ├── Textarea.jsx
│   ├── Checkbox.jsx
│   ├── FileUpload.jsx
│   ├── RadioGroup.jsx
│   ├── OTPInput.jsx
│   ├── PasswordRequirements.jsx
│   ├── CountdownTimer.jsx
│   └── MultiStepForm.jsx
├── Layouts/
│   └── MainLayout.jsx
├── Styles/
│   └── theme.js           # Design tokens
├── Utils/
│   └── formUtils.js       # Validators & utilities
└── Pages/
    └── Auth/
        ├── Login.jsx
        ├── Register.jsx
        ├── ForgotPassword.jsx
        └── ...
```

---

## Customization

To customize the design system:

1. **Edit theme.js** - Update colors, spacing, typography
2. **Component props** - Each component accepts style overrides via `className`
3. **Global styles** - Modify CSS in `resources/css/app.css`

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Support

For component issues or additions, check the component source files in `/resources/js/Components/`.
