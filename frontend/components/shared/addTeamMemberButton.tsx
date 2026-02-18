"use client";
import { useAppDispatch } from "@/Store/hooks";
import { showAddTeamMember } from "@/Store/slice/dialogsSlice";
import { Button } from "../ui/button";

function AddTeamMemberButton() {
  const dispatch = useAppDispatch();

  return (
    <Button onClick={() => dispatch(showAddTeamMember())}>
      Add Team Member
    </Button>
  );
}

export default AddTeamMemberButton;
