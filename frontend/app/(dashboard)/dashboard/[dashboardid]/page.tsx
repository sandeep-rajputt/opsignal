import { SidebarTrigger } from "@/components/ui/sidebar";

function Dashboard() {
  return (
    <div className="flex gap-5 items-center px-5 py-4">
      <SidebarTrigger />
      <h1>OPSIGNAL Dashboard</h1>
    </div>
  );
}

export default Dashboard;
