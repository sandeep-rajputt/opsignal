import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingComponent = "profile" | "security" | "sessions";

interface Dialogs {
  logout: boolean;
  addNewWorkspace: boolean;
  addWorkspaceSlot: boolean;
  setting:
    | {
        visible: true;
        component: SettingComponent;
      }
    | { visible: false; component: null };
}

const initialState: Dialogs = {
  logout: false,
  addNewWorkspace: false,
  addWorkspaceSlot: false,
  setting: {
    visible: false,
    component: null,
  },
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
    showSetting(state, actions: PayloadAction<SettingComponent>) {
      state.setting = { visible: true, component: actions.payload };
    },
    hideSetting(state) {
      state.setting = { visible: false, component: null };
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
  showSetting,
  hideSetting,
} = dialogsSlice.actions;

export default dialogsSlice.reducer;
