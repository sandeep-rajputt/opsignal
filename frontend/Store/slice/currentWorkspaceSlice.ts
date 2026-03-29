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
    updateWorkspaceSettings: (
      state,
      action: PayloadAction<{
        name?: string;
        description?: string | null;
        image?: string | null;
        id?: string;
      }>,
    ) => {
      if (state.workspace) {
        if (action.payload.name !== undefined) {
          state.workspace.name = action.payload.name;
        }
        if (action.payload.description !== undefined) {
          state.workspace.description = action.payload.description;
        }
        if (action.payload.image !== undefined) {
          state.workspace.image = action.payload.image;
        }
        if (action.payload.id !== undefined) {
          state.workspace.id = action.payload.id;
        }
      }
    },
  },
});

export const {
  setCurrentWorkspace,
  clearCurrentWorkspace,
  setWorkspaceStatus,
  updateWorkspaceSettings,
} = currentWorkspaceSlice.actions;

export default currentWorkspaceSlice.reducer;
