import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter password",
  showCriteria = true,
  required = true,
  autoComplete = "current-password"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Password criteria checks
  const criteria = {
    minLength: value.length >= 8,
    hasUppercase: /[A-Z]/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasNumber: /[0-9]/.test(value),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
  };

  const allCriteriaMet = Object.values(criteria).every(Boolean);
  const metCount = Object.values(criteria).filter(Boolean).length;
  const totalCriteria = Object.keys(criteria).length;

  // Password strength
  const getStrength = () => {
    if (metCount === 0) return { label: '', color: '', width: '0%' };
    if (metCount <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (metCount <= 3) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (metCount <= 4) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showCriteria && value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Password strength:</span>
            <span className={`font-semibold ${
              strength.label === 'Weak' ? 'text-red-600' :
              strength.label === 'Fair' ? 'text-yellow-600' :
              strength.label === 'Good' ? 'text-blue-600' :
              strength.label === 'Strong' ? 'text-green-600' : ''
            }`}>
              {strength.label}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      )}

      {/* Password Criteria */}
      {showCriteria && (isFocused || value.length > 0) && (
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
          <div className="space-y-1.5">
            <CriteriaItem met={criteria.minLength} text="At least 8 characters" />
            <CriteriaItem met={criteria.hasUppercase} text="One uppercase letter (A-Z)" />
            <CriteriaItem met={criteria.hasLowercase} text="One lowercase letter (a-z)" />
            <CriteriaItem met={criteria.hasNumber} text="One number (0-9)" />
            <CriteriaItem met={criteria.hasSpecial} text="One special character (!@#$%...)" />
          </div>
        </div>
      )}

      {/* Validation Message */}
      {value.length > 0 && !allCriteriaMet && showCriteria && (
        <p className="text-xs text-red-600 flex items-start gap-1">
          <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
          Please meet all password requirements
        </p>
      )}
    </div>
  );
};

const CriteriaItem = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
    ) : (
      <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
    )}
    <span className={met ? 'text-green-700' : 'text-gray-600'}>{text}</span>
  </div>
);

export default PasswordInput;
