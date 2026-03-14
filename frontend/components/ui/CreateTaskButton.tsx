"use client";

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
import { useAppDispatch } from "@/Store/hooks";
import {
  showCreateIncident,
  showCreateTask,
  showCreateImprovement,
} from "@/Store/slice/dialogsSlice";

function CreateTaskButton() {
  const dispatch = useAppDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1">
          <Plus /> Create <ChevronDown className="ml-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="gap-1 flex flex-col">
        <DropdownMenuItem onClick={() => dispatch(showCreateIncident())}>
          <IncidentSvg />
          Create Incident
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem onClick={() => dispatch(showCreateTask())}>
          <TaskSvg />
          Create Task
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem onClick={() => dispatch(showCreateImprovement())}>
          <ImprovementSvg />
          Create Improvement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CreateTaskButton;
