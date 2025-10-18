"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  label?: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  register?: UseFormRegisterReturn; // properly typed for react-hook-form
}

export default function InputField({
  label,
  placeholder,
  type = "text",
  register,
  required = false,
  onChange,
  value,
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-white mb-1">{label}</label>}
      <input
        {...(register || {})}
        type={type}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
        className="p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-400 transition"
      />
    </div>
  );
}
