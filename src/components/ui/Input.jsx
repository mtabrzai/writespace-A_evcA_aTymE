import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  fullWidth = false,
  size = 'medium',
  variant = 'outline',
  error = false,
  errorMessage = '',
  label = '',
  id = '',
  ...props
}) => {
  const baseStyles = 'rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variants = {
    outline: 'border border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    ghost: 'border-transparent focus:ring-blue-500 focus:border-transparent',
  };
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  const errorStyles = 'border-red-500 focus:ring-red-500 focus:border-red-500';

  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={clsx(fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          error && errorStyles,
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url', 'search']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['outline', 'ghost']),
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
};

export default Input;