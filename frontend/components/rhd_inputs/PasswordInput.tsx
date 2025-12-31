import { InputHTMLAttributes, useState } from "react";

type PasswordInputProps = {
  label?: string;
  register: InputHTMLAttributes<HTMLInputElement>;
  placeholder: string;
  error?: string;
  className?: string;
};

function PasswordInput({
  label,
  register,
  placeholder,
  error,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={register.name}>{placeholder}</label>}
      <div className="text-sm flex gap-1 border border-foreground/20 rounded-md px-2 pb-2 py-2.5">
        <input
          placeholder={placeholder}
          {...register}
          id={register.name}
          className="text-secondary outline-none w-full"
          type={showPassword ? "text" : "password"}
        />
        <button
          type="button"
          className="underline opacity-50 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "hide" : "show"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export default PasswordInput;
