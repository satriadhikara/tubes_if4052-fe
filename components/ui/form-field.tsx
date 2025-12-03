"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// ============ Form Field ============

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            className={`${icon ? "pl-10" : ""} ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            } ${className || ""}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// ============ Password Field ============

interface PasswordFieldProps extends Omit<FormFieldProps, "type"> {
  showPasswordToggle?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <FormField
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={showPasswordToggle ? "pr-10" : ""}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

// ============ Select Field ============

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = "Pilih opsi...",
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-md border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white px-3 py-2 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-2 focus:ring-[#C0287F]/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============ Textarea Field ============

interface TextareaFieldProps {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  placeholder,
  rows = 4,
  maxLength,
}: TextareaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full rounded-md border ${
          error ? "border-red-500" : "border-gray-300"
        } px-3 py-2 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-2 focus:ring-[#C0287F]/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
      />
      <div className="flex justify-between">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-sm text-gray-500">{hint}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p className="text-sm text-gray-400">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

// ============ Checkbox Field ============

interface CheckboxFieldProps {
  label: string | ReactNode;
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  error,
  disabled,
}: CheckboxFieldProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#C0287F] focus:ring-[#C0287F] disabled:cursor-not-allowed"
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
