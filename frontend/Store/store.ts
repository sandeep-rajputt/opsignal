import { configureStore } from "@reduxjs/toolkit";
import baseApi from "@/Store/api/baseApi";
import userReducer from "@/Store/slice/userSlice";
import dialogsReducer from "@/Store/slice/dialogsSlice";
import currentWorkspaceReducer from "@/Store/slice/currentWorkspaceSlice";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
    dialogs: dialogsReducer,
    currentWorkspace: currentWorkspaceReducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
