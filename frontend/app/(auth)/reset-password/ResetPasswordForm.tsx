"use client";
import emailSchema from "@/schemas/common/emailSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import TextInput from "@/components/rhd_inputs/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@/Store/api/resetPasswordApi/resetPasswordApi";
import { toast } from "sonner";
import isApiError from "@/utils/isApiError";

const FormDataSchema = z.object({
  email: emailSchema,
});

type FormData = z.infer<typeof FormDataSchema>;

function ResetPassword() {
  const [step, setStep] = useState<"form" | "mail">("form");
  const [resetPassword] = useResetPasswordMutation();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({ resolver: zodResolver(FormDataSchema) });

  async function onSubmit(data: FormData) {
    try {
      await resetPassword(data).unwrap();
      setStep("mail");
      toast.success("Password reset link sent successfully ✉️");
    } catch (error) {
      const apiError = isApiError(error);
      console.log(apiError);
      toast.error(
        apiError?.message || "Something went wrong, please try again later",
      );
    }
  }

  return (
    <div>
      {step === "form" && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <h2 className="text-4xl text-center font-bold text-foreground">
              Forgot password
            </h2>

            <p className="text-secondary w-full mx-auto mt-3 mb-2 max-w-sm text-center">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>
          </div>
          <TextInput
            register={register("email")}
            label="Email"
            placeholder="Enter Your Name"
            disabled={isSubmitting}
            error={errors.email?.message}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-fit mx-auto mt-7 px-7 py-2 rounded-md  bg-primary font-semibold text-white ${
              isSubmitting ? "cursor-wait" : "cursor-pointer"
            }`}
          >
            {isSubmitting ? "Submiting..." : "Submit"}
          </button>
        </form>
      )}
      {step === "mail" && (
        <div className="flex flex-col items-center text-center gap-4 mt-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <MailCheck size={22} />
          </div>

          <h3 className="text-xl font-semibold text-foreground">
            Check your email
          </h3>

          <p className="text-secondary max-w-sm">
            We’ve sent a password reset link to your email address. Please check
            your inbox and follow the instructions.
          </p>

          <p className="text-sm text-secondary">
            Didn’t receive the email? Check your spam folder.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
