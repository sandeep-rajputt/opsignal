import checkPrimaryWorkspace from "@/lib/checkPrimaryWorkspace";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const { status, hasWorkspace, workspaceId } = await checkPrimaryWorkspace();

  if (status === 200 && hasWorkspace && workspaceId) {
    redirect(`/dashboard/${workspaceId}`);
  }

  redirect("/login");
}

export default DashboardPage;
