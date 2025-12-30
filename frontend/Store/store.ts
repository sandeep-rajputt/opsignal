import { configureStore } from "@reduxjs/toolkit";
import baseApi from "@/Store/api/baseApi";
import authReducer from "@/Store/slices/authSlice";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
