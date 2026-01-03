import Link from "next/link";
import { InputHTMLAttributes, useState } from "react";

type PasswordInputProps = {
  label?: string;
  register: InputHTMLAttributes<HTMLInputElement>;
  placeholder: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  link?: string;
  handleClick?: () => void;
  forgotPasswordName?: string;
};

function PasswordInput({
  label = "Enter your password",
  register,
  placeholder,
  disabled = false,
  error,
  className = "",
  link = "",
  handleClick,
  forgotPasswordName = "Forgot Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex justify-between items-center gap-2">
        <label htmlFor={register.name}>{label}</label>
        {link && (
          <Link
            className={`text-tertiary text-xs underline ${
              disabled ? "cursor-default" : "cursor-pointer"
            }`}
            href={link}
          >
            {forgotPasswordName}
          </Link>
        )}
        {handleClick && (
          <button
            className={`cursor-pointer text-tertiary text-xs underline ${
              disabled ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={handleClick}
            disabled={disabled}
          >
            {forgotPasswordName}
          </button>
        )}
      </div>
      <div
        className={`text-sm flex gap-1 border border-foreground/20 rounded-md px-2 pb-2 py-2.5 ${
          disabled && "cursor-not-allowed opacity-40"
        }`}
      >
        <input
          placeholder={placeholder}
          {...register}
          id={register.name}
          disabled={disabled}
          className={`text-secondary outline-none w-full ${
            disabled && "cursor-not-allowed"
          }`}
          type={showPassword ? "text" : "password"}
        />
        <button
          type="button"
          disabled={disabled}
          className={`underline opacity-50  ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
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
