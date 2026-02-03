import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/schemas/userSchema";

interface UserSlice {
  user: User | null;
  isAuthenticated: boolean;
  status: "initial" | "loading" | "success" | "failed";
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
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updatePrimaryWorkspace: (
      state,
      action: PayloadAction<User["primaryWorkspace"]>,
    ) => {
      if (state.user) {
        state.user.primaryWorkspace = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, updatePrimaryWorkspace } = userSlice.actions;
export default userSlice.reducer;
