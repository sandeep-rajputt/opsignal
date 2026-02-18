import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/schemas/common/roleSchema";

interface CurrentWorkspace {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  role: UserRole | null;
  team?: string;
}

interface CurrentWorkspaceSlice {
  workspace: CurrentWorkspace | null;
  status: "initial" | "loading" | "success" | "failed";
}

const initialState: CurrentWorkspaceSlice = {
  workspace: null,
  status: "initial",
};

const currentWorkspaceSlice = createSlice({
  name: "currentWorkspace",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<CurrentWorkspace>) => {
      state.workspace = action.payload;
      state.status = "success";
    },
    clearCurrentWorkspace: (state) => {
      state.workspace = null;
      state.status = "initial";
    },
    setWorkspaceStatus: (
      state,
      action: PayloadAction<"initial" | "loading" | "success" | "failed">,
    ) => {
      state.status = action.payload;
    },
  },
});

export const {
  setCurrentWorkspace,
  clearCurrentWorkspace,
  setWorkspaceStatus,
} = currentWorkspaceSlice.actions;

export default currentWorkspaceSlice.reducer;
