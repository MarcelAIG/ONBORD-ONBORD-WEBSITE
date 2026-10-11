import React from 'react';

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  explanation?: string;
}

export function RadioGroup({ label, options, value, onChange, required, explanation }: RadioGroupProps) {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-medium text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex space-x-6">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="radio"
              name={label}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="w-4 h-4 text-red-500 bg-zinc-900 border-zinc-700 focus:ring-red-500/50 focus:ring-offset-zinc-950"
            />
            <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{option}</span>
          </label>
        ))}
      </div>
      {explanation && <p className="text-xs text-zinc-500">{explanation}</p>}
    </div>
  );
}
