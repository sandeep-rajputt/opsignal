import { redirect } from "next/navigation";
import { checkServerAuth } from "@/lib/validateServerAuth";

async function DashboardPage() {
  const { user } = await checkServerAuth();
  if (user?.workspace) {
    redirect(`/dashboard/${user.workspace}`);
  } else {
    redirect("/onboarding");
  }
}

export default DashboardPage;
