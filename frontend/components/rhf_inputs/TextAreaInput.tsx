import { TextareaHTMLAttributes } from "react";

type TextAreaInputProps = {
  label?: string;
  register: TextareaHTMLAttributes<HTMLTextAreaElement>;
  placeholder: string;
  error?: string;
  className?: string;
  disabled?: boolean;
};

function TextAreaInput({
  label,
  register,
  placeholder,
  error,
  className = "",
  disabled = false,
}: TextAreaInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor="">{label}</label>}
      <textarea
        rows={4}
        placeholder={placeholder}
        className={`text-secondary text-sm border border-foreground/20 outline-none rounded-md px-2 pb-2 py-2.5 ${
          disabled && "cursor-not-allowed opacity-40"
        }`}
        {...register}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export default TextAreaInput;
