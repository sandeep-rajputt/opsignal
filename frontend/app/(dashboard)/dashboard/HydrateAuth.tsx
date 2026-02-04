"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, updateAuthentication } from "@/Store/slice/userSlice";
import { User } from "@/schemas/userSchema";

export function HydrateAuth({
  user,
  auth,
}: {
  user: User | null;
  auth: boolean;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
      dispatch(
        updateAuthentication({ auth, status: auth ? "success" : "failed" }),
      );
    }
  }, [user, dispatch, auth]);

  return null;
}
