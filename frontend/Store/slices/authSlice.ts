import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Auth } from "@/types/auth.type";

const initialState: Auth = {
  token: null,
  userId: null,
  status: "initial",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogout(state) {
      state.status = "initial";
      state.token = null;
      state.userId = null;
    },
    authLogin(state, action: PayloadAction<{ token: string; userId: string }>) {
      state.status = "success";
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    authPending(state) {
      state.status = "pending";
    },
    authFailed(state) {
      state.status = "failed";
    },
  },
});

export const { authLogin, authLogout, authFailed, authPending } =
  authSlice.actions;

export default authSlice.reducer;
