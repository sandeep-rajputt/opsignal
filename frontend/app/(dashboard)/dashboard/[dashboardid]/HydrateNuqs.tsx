"use client";
import { useEffect } from "react";
import { useQueryState } from "nuqs";
import { useAppDispatch } from "@/Store/hooks";
import { showSetting } from "@/Store/slice/dialogsSlice";

function HydrateNuqs() {
  const dispatch = useAppDispatch();
  const [setting] = useQueryState("setting");

  useEffect(() => {
    if (
      setting === "profile" ||
      setting === "security" ||
      setting === "sessions"
    ) {
      console.log("update");
      dispatch(showSetting(setting));
    }
  }, []);

  return null;
}

export default HydrateNuqs;
