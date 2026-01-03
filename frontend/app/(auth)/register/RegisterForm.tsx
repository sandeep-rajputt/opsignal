"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/rhd_inputs/PasswordInput";
import type { RegisterCredential } from "@/schemas/registerCredentialSchema";
import TextInput from "@/components/rhd_inputs/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import registerCredentialSchema from "@/schemas/registerCredentialSchema";
import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import Link from "next/link";
import { useState } from "react";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredential>({
    resolver: zodResolver(registerCredentialSchema),
  });
  const [disabled, setDisabled] = useState<boolean>(false);

  const onSubmit = async (data: RegisterCredential) => {
    await new Promise((res) => setTimeout(res, 5000));
    console.log(data);
  };

  function disableClick() {
    setDisabled(true);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <TextInput
          register={register("name")}
          label="Name"
          placeholder="Your Name"
          disabled={disabled || isSubmitting}
          error={errors.name?.message}
        />
        <TextInput
          register={register("email")}
          label="Email"
          placeholder="Enter Your Name"
          disabled={disabled || isSubmitting}
          error={errors.email?.message}
        />

        <PasswordInput
          register={register("password")}
          label="Password"
          placeholder="Enter your password"
          disabled={disabled || isSubmitting}
          error={errors.password?.message}
        />
        <PasswordInput
          register={register("confirmPassword")}
          label="Confirm Password"
          placeholder="Confirm your password"
          disabled={disabled || isSubmitting}
          error={errors.confirmPassword?.message}
        />
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className={`w-fit mx-auto mt-7 px-7 py-2 rounded-md  bg-primary font-semibold text-white ${
            disabled || isSubmitting ? "cursor-wait" : "cursor-pointer"
          }`}
        >
          {isSubmitting ? "Submiting..." : "Submit"}
        </button>
      </form>

      <div className="flex flex-col mt-7 gap-5">
        <div className="w-full relative mt-5">
          <div className="h-px w-[40%] bg-tertiary/50 absolute left-0 top-2.5" />
          <div className="h-px w-[40%] bg-tertiary/50 absolute right-0 top-2.5" />
          <p className="mx-auto w-fit text-tertiary">OR</p>
        </div>

        <div className="flex gap-5 mt-5">
          <GoogleButton
            disable={disabled || isSubmitting}
            handleClick={disableClick}
          />
          <GithubButton
            disable={disabled || isSubmitting}
            handleClick={disableClick}
          />
        </div>

        <p className="text-center text-sm text-secondary">
          Have an account already?{" "}
          <Link href={"/login"} className="underline text-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
