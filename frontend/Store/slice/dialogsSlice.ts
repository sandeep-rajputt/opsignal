import { createSlice } from "@reduxjs/toolkit";

interface Dialogs {
  logout: boolean;
  addNewWorkspace: boolean;
}

const initialState: Dialogs = {
  logout: false,
  addNewWorkspace: false,
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
  },
});

export const {
  showLogout,
  showAddNewWorkspace,
  hideLogout,
  hideAddNewWorkspace,
} = dialogsSlice.actions;

export default dialogsSlice.reducer;
