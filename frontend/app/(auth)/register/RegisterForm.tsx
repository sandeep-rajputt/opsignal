"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/rhf_inputs/PasswordInput";
import type { RegisterCredential } from "@/Store/api/registerApi/schemas/registerCredentialSchema";
import TextInput from "@/components/rhf_inputs/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import registerCredentialSchema from "@/Store/api/registerApi/schemas/registerCredentialSchema";
import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import Link from "next/link";
import { useState } from "react";
import { useRegisterMutation } from "@/Store/api/index";
import { MailCheck } from "lucide-react";
import isApiError from "@/utils/isApiError";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredential>({
    resolver: zodResolver(registerCredentialSchema),
  });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [step, setStep] = useState<"form" | "mail">("form");
  const [signUp] = useRegisterMutation();
  const onSubmit = async (data: RegisterCredential) => {
    try {
      await signUp(data).unwrap();
      setStep("mail");
      reset();
    } catch (error) {
      const apiError = isApiError(error);
      toast.error(
        apiError?.message || "Something went wrong, please try again later",
      );
    }
  };

  function disableClick() {
    setDisabled(true);
  }

  return (
    <div>
      {step === "form" && (
        <>
          <h2 className="text-3xl sm:text-4xl text-center font-bold text-foreground">
            Register
          </h2>
          <p className="text-secondary w-full mx-auto mt-3 mb-7 max-w-sm text-center text-sm sm:text-base">
            Create your account to manage your workspaces and get started.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
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
              className={`w-full sm:w-fit mx-auto flex gap-2 items-center justify-center mt-7 px-7 py-2 rounded-md bg-primary font-semibold text-white ${
                disabled || isSubmitting ? "cursor-wait" : "cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <>
                  Submiting <Spinner />
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          <div className="flex flex-col mt-7 gap-5">
            {/* <div className="w-full relative mt-5">
              <div className="h-px w-[40%] bg-tertiary/50 absolute left-0 top-2.5" />
              <div className="h-px w-[40%] bg-tertiary/50 absolute right-0 top-2.5" />
              <p className="mx-auto w-fit text-tertiary">OR</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-5">
              <GoogleButton
                disable={disabled || isSubmitting}
                handleClick={disableClick}
              />
              <GithubButton
                disable={disabled || isSubmitting}
                handleClick={disableClick}
              />
            </div> */}

            <p className="text-center text-sm text-secondary">
              Have an account already?{" "}
              <Link href={"/login"} className="underline text-primary">
                Login here
              </Link>
            </p>
          </div>
        </>
      )}
      {step === "mail" && (
        <div className="flex flex-col items-center text-center gap-4 mt-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <MailCheck size={22} />
          </div>

          <h3 className="text-xl font-semibold text-foreground">
            Verify your email
          </h3>

          <p className="text-secondary max-w-sm">
            We’ve sent a verification link to your email address. Please check
            your inbox and confirm your email to complete registration.
          </p>

          <p className="text-sm text-danger/70 max-w-sm">
            If you don’t verify your email within 3 hours, this account will be
            deleted automatically.
          </p>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
