import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * CustomInput
 * Tailwind-only version of the original CSS module component.
 * Two label variants:
 *  - 'top-label'    : label rendered above the field
 *  - 'inside-label' : small label floated inside the field, top-left
 */
const CustomInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  variant = 'top-label', // 'top-label' | 'inside-label'
  error,
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isInsideLabel = variant === 'inside-label';

  return (
    <div className={`flex w-full flex-col mb-4 text-white ${className}`}>
      {/* Top Label Mode */}
      {variant === 'top-label' && label && (
        <label htmlFor={inputId} className="mb-1.5 text-sm font-semibold text-gray-200">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex w-full items-center">
        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            'w-full rounded-xl border bg-[#121214] text-white text-sm outline-none',
            'placeholder:text-gray-500',
            'transition-colors duration-200',
            'focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20',
            isInsideLabel ? 'pt-5.5 pb-2.5 px-4' : 'py-3 px-4',
            isPassword ? 'pr-11' : '',
            error ? 'border-red-500' : 'border-[#2d2d32]',
          ].join(' ')}
          {...props}
        />

        {/* Inside Label Overlay */}
        {isInsideLabel && label && (
          <label
            htmlFor={inputId}
            className="pointer-events-none absolute left-4 top-2 text-[11px] font-medium text-gray-400"
          >
            {label}
          </label>
        )}

        {/* Password Visibility Toggle */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3.5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Optional Error Message */}
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default CustomInput;