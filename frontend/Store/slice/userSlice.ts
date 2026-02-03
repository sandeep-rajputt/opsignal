import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/schemas/userSchema";

type status = "initial" | "loading" | "success" | "failed";

interface UserSlice {
  user: User | null;
  isAuthenticated: boolean;
  status: status;
}

const initialState: UserSlice = {
  user: null,
  isAuthenticated: false,
  status: "initial",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateAuthentication: (
      state,
      action: PayloadAction<{ auth: boolean; status: status }>,
    ) => {
      state.isAuthenticated = action.payload.auth;
      state.status = action.payload.status;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updatePrimaryWorkspace: (
      state,
      action: PayloadAction<User["workspace"]>,
    ) => {
      if (state.user) {
        state.user.workspace = action.payload;
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  updatePrimaryWorkspace,
  updateAuthentication,
} = userSlice.actions;
export default userSlice.reducer;
