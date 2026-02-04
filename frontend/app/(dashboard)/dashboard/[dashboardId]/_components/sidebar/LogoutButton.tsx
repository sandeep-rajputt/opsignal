"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { MenubarItem } from "@/components/ui/menubar";
import { toast } from "sonner";
import { useLogoutUserMutation } from "@/Store/api/logoutUserApi";
import isApiError from "@/utils/isApiError";
import { Spinner } from "@/components/ui/spinner";

const LogOutButton = () => {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenubarItem
          variant="destructive"
          className="flex items-center gap-2"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <LogOut className="text-red-400" />
          Logout
        </MenubarItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 justify-end">
          {!isLoading && (
            <Button variant="outline" onClick={() => setOpen(false)}>
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
};

export default memo(LogOutButton);
