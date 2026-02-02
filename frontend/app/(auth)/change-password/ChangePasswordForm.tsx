"use client";
import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/rhf_inputs/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import changePasswordSchema from "@/schemas/changePasswordSchema";
import { z } from "zod";
import { useCheckChangePasswordTokenMutation } from "@/Store/api/checkChangePasswordToken/checkChangePasswordToken";
import { TriangleAlert } from "lucide-react";
import FlyingLoader from "@/components/shared/FlyingLoader";
import isApiError from "@/utils/isApiError";
import { useChangeUserPasswordMutation } from "@/Store/api";
import { toast } from "sonner";

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

function ChangePasswordForm() {
  const [token] = useQueryState("token");
  const [id] = useQueryState("id");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [formState, setFormState] = useState<
    "initial" | "failed" | "success" | "success-change"
  >("initial");
  const [checkToken] = useCheckChangePasswordTokenMutation();
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ChangePasswordData) => {
    if (!token || !id) {
      toast.error("Invalid request parameters");
      return;
    }

    try {
      await changeUserPassword({
        token,
        id,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
      }).unwrap();

      setFormState("success-change");
      toast.success("Password changed successfully");
    } catch (error) {
      const apiError = isApiError(error);

      toast.error(
        apiError?.message || "Something went wrong, please try again later",
      );
    }
  };

  useEffect(() => {
    async function verifyToken() {
      if (formState === "initial") {
        if (token && id) {
          try {
            await checkToken({ token, id }).unwrap();

            setFormState("success");
            setError(null);
          } catch (error) {
            const apiError = isApiError(error);

            setError(
              apiError?.message ||
                "Something went wrong, Please try again later",
            );
            setFormState("failed");
          }
        } else {
          setFormState("failed");
          setError("Requested link is invalid");
        }
      }
    }

    verifyToken();
  }, []);

  return (
    <>
      {formState === "failed" && (
        <div className="flex flex-col my-5 items-center justify-center gap-5">
          <TriangleAlert size={50} className="text-danger" />
          <p className="text-secondary">{error}</p>
        </div>
      )}
      {formState === "success-change" && (
        <div className="flex flex-col my-5 items-center justify-center gap-5">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-center text-foreground font-semibold">
            Password Changed Successfully
          </p>
          <p className="text-secondary text-center">
            Your password has been updated. You can now login with your new
            password.
          </p>
        </div>
      )}
      {formState === "success" && (
        <div>
          <h2 className="text-4xl text-center font-bold text-foreground">
            Change password
          </h2>

          <p className="text-secondary w-full mx-auto mt-3 mb-7 max-w-sm text-center">
            Set a new password to keep your account secure and continue.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <PasswordInput
              register={register("password")}
              label="New Password"
              placeholder="Enter new password"
              disabled={isSubmitting}
              error={errors.password?.message}
            />

            <PasswordInput
              register={register("confirmPassword")}
              label="Confirm New Password"
              placeholder="Confirm new password"
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-fit mx-auto mt-7 px-7 py-2 rounded-md bg-primary font-semibold text-white ${
                isSubmitting ? "cursor-wait" : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
      {formState === "initial" && (
        <div>
          <FlyingLoader height="h-[250px]" />
          <p className="text-center text-secondary">Checking your link...</p>
        </div>
      )}
    </>
  );
}

export default ChangePasswordForm;
