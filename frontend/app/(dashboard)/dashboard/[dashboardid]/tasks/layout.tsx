import CreateTaskButton from "@/components/ui/CreateTaskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

function Tasks({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex gap-5 items-center w-full justify-between px-5 py-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />
          <h1 className="font-semibold">Tasks</h1>
        </div>
        <div>
          <CreateTaskButton />
        </div>
      </div>
      {children}
    </div>
  );
}

export default Tasks;
