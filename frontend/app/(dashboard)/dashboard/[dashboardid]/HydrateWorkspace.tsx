"use client";

import { useEffect } from "react";
import { useGetWorkspaceBasicInfoQuery } from "@/Store/api/getWorkspaceBasicInfoApi/getWorkspaceBasicInfoApi";
import { useAppDispatch } from "@/Store/hooks";
import {
  setCurrentWorkspace,
  setWorkspaceStatus,
} from "@/Store/slice/currentWorkspaceSlice";

export default function HydrateWorkspace({
  dashboardId,
}: {
  dashboardId: string;
}) {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error } =
    useGetWorkspaceBasicInfoQuery(dashboardId);

  useEffect(() => {
    if (isLoading) {
      dispatch(setWorkspaceStatus("loading"));
    } else if (isError) {
      console.log(error);
      dispatch(setWorkspaceStatus("failed"));
    } else if (data?.data) {
      dispatch(
        setCurrentWorkspace({
          id: data.data.id,
          name: data.data.name,
          description: data.data.description,
          image: data.data.logo_url,
          role: data.data.role,
        }),
      );
    }
  }, [data, isLoading, isError, error, dispatch]);

  return null;
}
