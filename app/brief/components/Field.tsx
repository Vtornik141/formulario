import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, hint, required, children }: FieldProps) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-semibold mb-1.5 text-grafito">
        {label}
        {required && <span className="text-musgo"> *</span>}
      </span>
      {hint && <span className="block text-xs mb-2 text-grafito-soft">{hint}</span>}
      {children}
    </label>
  );
}
