import IncidentSvg from "@/svg/IncidentSvg";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import ImprovementSvg from "@/svg/ImprovementSvg";
import TaskSvg from "@/svg/TaskSvg";
import { Separator } from "./separator";

function CreateTaskButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="gap-1">
          <Plus /> Create <ChevronDown className="ml-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="gap-1 flex flex-col">
        <DropdownMenuItem>
          <IncidentSvg />
          Create Incident
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <TaskSvg />
          Create Task
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <ImprovementSvg />
          Create Improvement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CreateTaskButton;
