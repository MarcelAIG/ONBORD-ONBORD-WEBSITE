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
  const hasLongOption = options.some((opt) => opt.length > 18);
  const isCompact = !hasLongOption && options.length <= 4;
  const groupName = label.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

  return (
    <div className="flex flex-col space-y-2.5">
      <label className="text-sm font-medium text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={
          isCompact
            ? 'grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'
        }
      >
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <label
              key={option}
              className={`relative flex items-center p-3 sm:p-3.5 rounded-xl border text-sm transition-all duration-150 cursor-pointer select-none group min-h-[46px] ${
                isSelected
                  ? 'bg-red-500/10 border-red-500/50 text-zinc-50 shadow-sm ring-1 ring-red-500/30'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40 active:bg-zinc-900/60'
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={isSelected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'border-red-500 bg-red-500'
                    : 'border-zinc-700 bg-zinc-900 group-hover:border-zinc-500'
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="font-normal leading-snug break-words text-xs sm:text-sm">{option}</span>
            </label>
          );
        })}
      </div>
      {explanation && <p className="text-xs text-zinc-500">{explanation}</p>}
    </div>
  );
}
