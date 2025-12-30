import { createSlice } from "@reduxjs/toolkit";
import type { Auth } from "@/types/auth.type";

const initialState: Auth = {
  token: "",
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export default authSlice.reducer;
