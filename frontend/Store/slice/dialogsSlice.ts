import { createSlice } from "@reduxjs/toolkit";

interface Dialogs {
  logout: boolean;
  addNewWorkspace: boolean;
  addWorkspaceSlot: boolean;
}

const initialState: Dialogs = {
  logout: false,
  addNewWorkspace: false,
  addWorkspaceSlot: false,
};

const dialogsSlice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    showLogout(state) {
      state.logout = true;
    },
    hideLogout(state) {
      state.logout = false;
    },
    showAddNewWorkspace(state) {
      state.addNewWorkspace = true;
    },
    hideAddNewWorkspace(state) {
      state.addNewWorkspace = false;
    },
    showAddWorkspaceSlot(state) {
      state.addWorkspaceSlot = true;
    },
    hideAddWorkspaceSlot(state) {
      state.addWorkspaceSlot = false;
    },
  },
});

export const {
  showLogout,
  showAddNewWorkspace,
  hideLogout,
  hideAddNewWorkspace,
  showAddWorkspaceSlot,
  hideAddWorkspaceSlot,
} = dialogsSlice.actions;

export default dialogsSlice.reducer;
