import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function TextInput({ invalid, className, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition bg-crema-soft text-grafito border focus:border-musgo ${
        invalid ? "border-[1.5px] border-[#B4564E]" : "border-line"
      } ${className ?? ""}`}
    />
  );
}
