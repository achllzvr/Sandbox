import React, { useState } from 'react';
import { colors, shadows, borderRadius } from '../Styles/theme';
import Button from './Button';

/**
 * Multi-step form component
 * @param {Array} steps - Array of step configurations {title, description, fields}
 * @param {function} onSubmit - Submit handler for final step
 * @param {boolean} showProgressBar - Show progress indicator
 * @param {ReactNode} children - Form fields (passed via render prop or children)
 */
export const MultiStepForm = ({
  steps = [],
  onSubmit,
  onStepChange,
  showProgressBar = true,
  children,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      onStepChange?.(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit?.(currentStep);
  };

  const step = steps[currentStep];

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor:
                    index <= currentStep ? colors.button.primary : colors.border.light,
                  borderRadius: borderRadius.full,
                  transition: 'background-color 200ms ease',
                }}
              />
            ))}
          </div>
          <p
            style={{
              color: colors.text.light,
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      )}

      {/* Step Title & Description */}
      <div>
        {step?.title && (
          <h2
            style={{
              color: colors.text.primary,
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            {step.title}
          </h2>
        )}
        {step?.description && (
          <p
            style={{
              color: colors.text.secondary,
              fontSize: '0.95rem',
            }}
          >
            {step.description}
          </p>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {typeof children === 'function' ? children(currentStep) : children}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          ← Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button variant="primary" onClick={handleNext}>
            Next Step →
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
