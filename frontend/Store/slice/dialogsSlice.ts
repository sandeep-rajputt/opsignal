import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingComponent = "profile" | "security" | "sessions";

interface Dialogs {
  logout: boolean;
  addNewWorkspace: boolean;
  addWorkspaceSlot: boolean;
  addWorkspaceMember: boolean;
  addTeamMember: boolean;
  createIncident: boolean;
  createTask: boolean;
  createImprovement: boolean;
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
  addWorkspaceMember: false,
  addTeamMember: false,
  createIncident: false,
  createTask: false,
  createImprovement: false,
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
    showAddWorkspaceMember(state) {
      state.addWorkspaceMember = true;
    },
    hideAddWorkspaceMember(state) {
      state.addWorkspaceMember = false;
    },
    showAddTeamMember(state) {
      state.addTeamMember = true;
    },
    hideAddTeamMember(state) {
      state.addTeamMember = false;
    },
    showCreateIncident(state) {
      state.createIncident = true;
    },
    hideCreateIncident(state) {
      state.createIncident = false;
    },
    showCreateTask(state) {
      state.createTask = true;
    },
    hideCreateTask(state) {
      state.createTask = false;
    },
    showCreateImprovement(state) {
      state.createImprovement = true;
    },
    hideCreateImprovement(state) {
      state.createImprovement = false;
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
  showAddWorkspaceMember,
  hideAddWorkspaceMember,
  showAddTeamMember,
  hideAddTeamMember,
  showCreateIncident,
  hideCreateIncident,
  showCreateTask,
  hideCreateTask,
  showCreateImprovement,
  hideCreateImprovement,
} = dialogsSlice.actions;

export default dialogsSlice.reducer;
