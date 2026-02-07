"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { hideAddWorkspaceSlot } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";

function AddWorkspaceSlotDialog() {
  const workspaceSlot = useAppSelector(
    (state) => state.dialogs.addWorkspaceSlot,
  );
  const dispatch = useAppDispatch();

  async function handleLogout() {
    dispatch(hideAddWorkspaceSlot());
  }

  return (
    <Dialog
      open={workspaceSlot}
      onOpenChange={() => dispatch(hideAddWorkspaceSlot())}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Add workspace slot</DialogTitle>
          <DialogDescription>
            Are you sure you want to add a workspace slot? This will cost ₹10.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => dispatch(hideAddWorkspaceSlot())}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              handleLogout();
            }}
            className="flex gap-2 items-center justify-center"
          >
            Add Slot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddWorkspaceSlotDialog;
