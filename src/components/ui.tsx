import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { CheckCircle, UploadCloud, X } from 'lucide-react';

export function Card({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>}
          {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-6">{children}</div>
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
      <label htmlFor={id} className="text-sm font-medium text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {explanation && <p className="text-xs text-zinc-500">{explanation}</p>}
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
        className="flex h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
        className="flex min-h-[100px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-y"
      />
    </FieldWrapper>
  );
}
