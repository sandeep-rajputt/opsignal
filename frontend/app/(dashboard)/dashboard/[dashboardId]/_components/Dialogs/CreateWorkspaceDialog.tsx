"use client";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { Timezone } from "@/schemas/common/timezoneSchema";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { hideAddNewWorkspace } from "@/Store/slice/dialogsSlice";

function CreateWorkspaceDialog({
  detectedTimezone,
}: {
  detectedTimezone: Timezone;
}) {
  const addNewWorkspace = useAppSelector(
    (state) => state.dialogs.addNewWorkspace,
  );
  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={addNewWorkspace}
      onOpenChange={() => dispatch(hideAddNewWorkspace())}
    >
      <DialogContent className="w-full max-w-2xl! ">
        <DialogTitle>Create New Workspace</DialogTitle>
        <div className="no-scrollbar overflow-y-auto max-h-[90dvh]!">
          <CreateWorkspaceForm
            detectedTimezone={detectedTimezone as Timezone}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspaceDialog;
