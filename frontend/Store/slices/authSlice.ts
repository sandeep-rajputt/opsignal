import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AuthSchema, { Auth } from "@/schemas/AuthSchema";

const fetchDataFromLocalStorage = createAsyncThunk("fetch", () => {
  const data = JSON.parse("auth");
  const parsedData = AuthSchema.safeParse(data);
  return parsedData.success
    ? parsedData.data
    : { token: null, status: "initial" };
});

const initialState: Auth = {
  token: null,
  status: "initial",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogout(state) {
      state.status = "initial";
      state.token = null;
      const authData: Auth = {
        status: "initial",
        token: null,
      };
      localStorage.setItem("auth", JSON.stringify(authData));
    },
    authLogin(state, action: PayloadAction<{ token: string }>) {
      state.status = "success";
      state.token = action.payload.token;
      const authData: Auth = {
        status: "success",
        token: action.payload.token,
      };
      localStorage.setItem("auth", JSON.stringify(authData));
    },
    authPending(state) {
      state.status = "pending";
      const authData: Auth = { ...state, status: "pending" };
      localStorage.setItem("auth", JSON.stringify(authData));
    },
    authFailed(state) {
      state.status = "failed";
      const authData: Auth = { ...state, status: "failed" };
      localStorage.setItem("auth", JSON.stringify(authData));
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchDataFromLocalStorage.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchDataFromLocalStorage.fulfilled, (state, action) => {
      state = action.payload as Auth;
    });
    builder.addCase(fetchDataFromLocalStorage.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { authLogin, authLogout, authFailed, authPending } =
  authSlice.actions;

export default authSlice.reducer;
