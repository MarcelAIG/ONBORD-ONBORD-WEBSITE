import React from 'react';

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  explanation?: string;
  allowExclusiveNone?: boolean;
}

export function CheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  required,
  explanation,
  allowExclusiveNone = false,
}: CheckboxGroupProps) {
  const toggleOption = (option: string) => {
    if (allowExclusiveNone && option === 'None') {
      if (selectedValues.includes('None')) {
        onChange([]);
      } else {
        onChange(['None']);
      }
      return;
    }

    let nextValues = selectedValues.filter((v) => v !== 'None');
    if (nextValues.includes(option)) {
      nextValues = nextValues.filter((v) => v !== option);
    } else {
      nextValues = [...nextValues, option];
    }
    onChange(nextValues);
  };

  return (
    <div className="flex flex-col space-y-2.5">
      <label className="text-sm font-medium text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option);
          return (
            <label
              key={option}
              className={`flex items-center space-x-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none group min-h-[46px] ${
                isChecked
                  ? 'bg-red-500/10 border-red-500/50 text-zinc-50 shadow-sm ring-1 ring-red-500/30'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40 active:bg-zinc-900/60'
              }`}
            >
              <input
                type="checkbox"
                value={option}
                checked={isChecked}
                onChange={() => toggleOption(option)}
                className="w-4 h-4 rounded text-red-500 bg-zinc-900 border-zinc-700 focus:ring-red-500/50 focus:ring-offset-zinc-950 transition-colors cursor-pointer flex-shrink-0"
              />
              <span className="text-xs sm:text-sm group-hover:text-zinc-100 select-none leading-snug break-words">
                {option}
              </span>
            </label>
          );
        })}
      </div>
      {explanation && <p className="text-xs text-zinc-500">{explanation}</p>}
    </div>
  );
}
