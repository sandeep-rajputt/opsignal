"use client";
import { useAppDispatch } from "@/Store/hooks";
import { showAddWorkspaceMember } from "@/Store/slice/dialogsSlice";
import { Button } from "../ui/button";

function AddWorkspaceMemberButton() {
  const dispatch = useAppDispatch();

  return (
    <Button onClick={() => dispatch(showAddWorkspaceMember())}>
      Add Member
    </Button>
  );
}

export default AddWorkspaceMemberButton;
