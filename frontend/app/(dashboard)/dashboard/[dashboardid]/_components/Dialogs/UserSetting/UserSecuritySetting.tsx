"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import changePasswordRequestSchema, {
  type ChangePasswordRequest,
} from "@/Store/api/changePasswordApi/schema/changePasswordRequestSchema";
import { useChangePasswordMutation } from "@/Store/api/changePasswordApi/changePasswordApi";
import { toast } from "sonner";
import isApiError from "@/utils/isApiError";
import { Spinner } from "@/components/ui/spinner";

function UserSecuritySetting() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordRequestSchema),
  });

  const onSubmit = async (data: ChangePasswordRequest) => {
    try {
      await changePassword(data).unwrap();
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      const apiError = isApiError(error);
      toast.error(
        apiError?.message || "Failed to change password. Please try again.",
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Security</h3>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Change Password</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your password to keep your account secure
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      {...register("currentPassword")}
                      disabled={isLoading}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      {...register("newPassword")}
                      disabled={isLoading}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Confirm new password"
                      {...register("confirmNewPassword")}
                      disabled={isLoading}
                    />
                    {errors.confirmNewPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmNewPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => reset()}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      {isLoading ? <Spinner /> : "Change Password"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication
                </p>
                <Button variant="outline" size="sm" disabled>
                  Enable 2FA (Coming Soon)
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Delete Account</h4>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSecuritySetting;
