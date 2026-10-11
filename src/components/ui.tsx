import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { CheckCircle, UploadCloud, X } from 'lucide-react';

export function Card({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-xl">
      {(title || subtitle) && (
        <div className="mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-800/60">
          {title && <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-5 sm:space-y-6">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  explanation?: string;
  id: string;
}

export function FieldWrapper({ label, required, explanation, id, children }: FieldProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={id} className="text-xs sm:text-sm font-medium text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {explanation && <p className="text-xs text-zinc-500 leading-normal">{explanation}</p>}
    </div>
  );
}

export function Input({
  label,
  explanation,
  required,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  return (
    <FieldWrapper label={label} required={required} explanation={explanation} id={props.id}>
      <input
        {...props}
        required={required}
        className="flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  explanation,
  required,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  return (
    <FieldWrapper label={label} required={required} explanation={explanation} id={props.id}>
      <textarea
        {...props}
        required={required}
        className="flex min-h-[105px] w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-y"
      />
    </FieldWrapper>
  );
}
