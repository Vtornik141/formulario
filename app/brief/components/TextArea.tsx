import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function TextArea({ invalid, className, rows, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      rows={rows ?? 3}
      className={`w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition resize-none bg-crema-soft text-grafito border focus:border-musgo ${
        invalid ? "border-[1.5px] border-[#B4564E]" : "border-line"
      } ${className ?? ""}`}
    />
  );
}
