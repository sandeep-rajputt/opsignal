"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogoutUserMutation } from "@/Store/api/logoutUserApi";
import isApiError from "@/utils/isApiError";
import { Spinner } from "@/components/ui/spinner";
import { hideLogout } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";

function LogoutDialog() {
  const logout = useAppSelector((state) => state.dialogs.logout);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  async function handleLogout() {
    try {
      await logoutUser(null);
      router.push("/login");
      toast.success("Logout successfully");
    } catch (error) {
      const apiError = isApiError(error);
      toast.error(
        apiError?.message || "Something went wrong, please try again later",
      );
    } finally {
      dispatch(hideLogout());
    }
  }

  return (
    <Dialog open={logout} onOpenChange={() => dispatch(hideLogout())}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 justify-end">
          {!isLoading && (
            <Button variant="outline" onClick={() => dispatch(hideLogout())}>
              Cancel
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => {
              handleLogout();
            }}
            disabled={isLoading}
            className="flex gap-2 items-center justify-center"
          >
            Logout
            {isLoading && <Spinner />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutDialog;
