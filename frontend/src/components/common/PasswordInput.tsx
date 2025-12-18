import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  error,
  className = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}