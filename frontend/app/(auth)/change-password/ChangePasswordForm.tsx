"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/rhd_inputs/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import changePasswordSchema from "@/schemas/changePasswordSchema";
import { z } from "zod";

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    await new Promise((res) => setTimeout(res, 5000));
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
  );
}

export default ChangePasswordForm;
