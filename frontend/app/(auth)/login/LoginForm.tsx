"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/rhf_inputs/PasswordInput";
import type { LoginCredential } from "@/Store/api/loginApi/schemas/loginCredentialSchema";
import TextInput from "@/components/rhf_inputs/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import loginCredentialSchema from "@/Store/api/loginApi/schemas/loginCredentialSchema";
import GoogleButton from "@/components/auth/GoogleButton";
import GithubButton from "@/components/auth/GithubButton";
import Link from "next/link";
import { useState } from "react";
import { useLoginMutation } from "@/Store/api/index";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import isApiError from "@/utils/isApiError";
import { useAppDispatch } from "@/Store/hooks";
import { setUser } from "@/Store/slice/userSlice";
import { Spinner } from "@/components/ui/spinner";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredential>({
    resolver: zodResolver(loginCredentialSchema),
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login] = useLoginMutation();
  const [disabled, setDisabled] = useState<boolean>(false);

  const onSubmit = async (data: LoginCredential) => {
    try {
      const res = await login(data).unwrap();
      toast.success("Logged in Successfully");
      if (res.data.workspaceId) {
        dispatch(
          setUser({
            id: res.data.workspaceId,
            name: res.data.name,
            email: res.data.email,
            timezone: res.data.timezone,
            workspace: null,
          }),
        );
        router.push(`/dashboard/${res.data.workspaceId}`);
      } else {
        router.push("/onboarding");
      }
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          link="/reset-password"
          disabled={disabled || isSubmitting}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className={`w-fit mx-auto mt-7 px-7 flex items-center justify-center gap-2 py-2 rounded-md  bg-primary font-semibold text-white ${
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
