import { cookies } from "next/headers";
import env from "@/config/env";

type ResponseType = {
  message: string;
  status: number;
  data: { stack?: string; id?: string };
  timestamp: string;
};

async function checkPrimaryWorkspace() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const baseUrl =
      env.ENV === "development" ? env.BACKEND_DEVELOPMENT_URL : env.BACKEND_URL;

    const res = await fetch(`${baseUrl}/api/workspace/check-primary`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data: ResponseType = JSON.parse(await res.text()); // <-- not json

    if (res.status === 200 && data.data.id) {
      return { status: 200, hasWorkspace: true, workspaceId: data.data.id };
    } else if (res.status === 400) {
      return { status: 400, hasWorkspace: false };
    } else if (res.status === 500) {
      return { status: 500, hasWorkspace: false };
    }

    return { status: res.status, hasWorkspace: false };
  } catch (error) {
    console.error("Error checking primary workspace:", error);
    return { status: 500, hasWorkspace: false };
  }
}

export default checkPrimaryWorkspace;
