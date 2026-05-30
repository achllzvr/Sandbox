/**
 * Validation utilities for common form patterns
 */

import React from 'react';

export const validators = {
  // Email validation
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain number';
    return '';
  },

  // Confirm password
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  },

  // Required field
  required: (value) => {
    if (!value || value.trim() === '') return 'This field is required';
    return '';
  },

  // Phone number
  phone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value)) return 'Invalid phone number';
    return '';
  },

  // URL validation
  url: (value) => {
    try {
      new URL(value);
      return '';
    } catch {
      return 'Invalid URL';
    }
  },

  // Number validation
  number: (value) => {
    if (!value) return 'Number is required';
    if (isNaN(value)) return 'Must be a valid number';
    return '';
  },

  // Min length
  minLength: (value, min) => {
    if (!value) return `This field is required`;
    if (value.length < min) return `Must be at least ${min} characters`;
    return '';
  },

  // Max length
  maxLength: (value, max) => {
    if (value && value.length > max) return `Must not exceed ${max} characters`;
    return '';
  },

  // Date validation
  date: (value) => {
    if (!value) return 'Date is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    return '';
  },

  // Age validation (minimum age in years)
  minAge: (birthDate, minAge) => {
    if (!birthDate) return 'Date of birth is required';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < minAge) return `You must be at least ${minAge} years old`;
    return '';
  },
};

/**
 * Form state management hook
 */
export const useFormState = (initialValues) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const setFieldTouched = (name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setIsSubmitting,
    resetForm,
  };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default {
  validators,
  useFormState,
  sanitizeInput,
  formatDate,
  debounce,
};
