import React, { forwardRef, useRef } from 'react';
import { colors, borderRadius } from '../Styles/theme';

/**
 * File upload component with drag-and-drop support
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {function} onChange - Change handler
 * @param {Array} accept - Accepted file types
 * @param {boolean} multiple - Allow multiple files
 * @param {string} helpText - Help text below the input
 */
export const FileUpload = forwardRef(({
  label,
  error,
  onChange,
  accept = '*',
  multiple = false,
  helpText,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const inputRef = useRef(ref);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const fileUploadId = props.id || `file-upload-${Math.random()}`;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (onChange && e.dataTransfer.files) {
      onChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={fileUploadId}
          style={{ color: colors.text.primary, fontWeight: 600 }}
          className="text-sm"
        >
          {label}
          {required && <span style={{ color: colors.status.error }}>*</span>}
        </label>
      )}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          backgroundColor: isDragActive ? colors.button.primaryLight : colors.input.bg,
          border: `2px dashed ${isDragActive ? colors.button.primary : colors.input.border}`,
          borderRadius: borderRadius.lg,
          padding: '2rem',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 200ms ease',
          opacity: disabled ? 0.6 : 1,
        }}
        className={className}
      >
        <input
          ref={inputRef}
          type="file"
          id={fileUploadId}
          onChange={onChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          style={{ display: 'none' }}
          {...props}
        />
        <div style={{ color: colors.text.primary }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⬆</div>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            Drag files here or click to select
          </p>
          {helpText && (
            <p style={{ color: colors.text.light, fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {helpText}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p style={{ color: colors.status.error }} className="text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
