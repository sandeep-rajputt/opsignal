"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/rhd_inputs/PasswordInput";
import type { LoginCredential } from "@/schemas/loginCredentialSchema";
import TextInput from "@/components/rhd_inputs/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import loginCredentialSchema from "@/schemas/loginCredentialSchema";
import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import Link from "next/link";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredential>({
    resolver: zodResolver(loginCredentialSchema),
  });

  const onSubmit = (data: LoginCredential) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <TextInput
          register={register("email")}
          label="Email"
          placeholder="Enter Your Name"
          error={errors.email?.message}
        />

        <PasswordInput
          register={register("password")}
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
        />

        <button
          type="submit"
          className="w-fit mx-auto mt-7 px-5 py-2 rounded-md cursor-pointer bg-primary font-semibold text-white"
        >
          Submit
        </button>
      </form>

      <div className="flex flex-col gap-5">
        <div className="w-full relative mt-5">
          <div className="h-px w-[40%] bg-tertiary/50 absolute left-0 top-2.5" />
          <div className="h-px w-[40%] bg-tertiary/50 absolute right-0 top-2.5" />
          <p className="mx-auto w-fit text-tertiary">OR</p>
        </div>

        <div className="flex gap-5 mt-5">
          <GoogleButton disable={isSubmitting} />
          <GithubButton disable={isSubmitting} />
        </div>

        <p className="text-center text-secondary">
          Don’t have an account?{" "}
          <Link href={"/register"} className="underline">
            Create one now.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
