import { InputHTMLAttributes } from "react";

type TextInputProps = {
  label?: string;
  register: InputHTMLAttributes<HTMLInputElement>;
  placeholder: string;
  error?: string;
  className?: string;
  disabled?: boolean;
};

function TextInput({
  label,
  register,
  placeholder,
  error,
  className = "",
  disabled = false,
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className} `}>
      {label && <label htmlFor="">{label}</label>}
      <input
        placeholder={placeholder}
        className={`text-secondary text-sm border border-foreground/20  outline-none rounded-md px-2 pb-2 py-2.5 ${
          disabled && "cursor-not-allowed opacity-40"
        }`}
        type="text"
        {...register}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export default TextInput;
