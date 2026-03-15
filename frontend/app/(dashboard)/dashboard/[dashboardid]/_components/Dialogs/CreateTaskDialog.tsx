"use client";

import { hideCreateTask } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskSvg from "@/svg/TaskSvg";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createTaskSchema, { CreateTask } from "@/schemas/createTaskSchema";
import { TeamFieldByPermission } from "../others/CreateWorkTeamField";
import { useCreateTaskMutation } from "@/Store/api/createTaskApi/createTaskApi";
import { toast } from "sonner";

function CreateTaskDialog() {
  const dispatch = useAppDispatch();
  const isCreateTaskOpen = useAppSelector((state) => state.dialogs.createTask);
  const workspaceId = useAppSelector(
    (state) => state.currentWorkspace.workspace?.id,
  );

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateTask>({
    resolver: zodResolver(createTaskSchema),
  });

  async function onSubmit(data: CreateTask) {
    if (!workspaceId) return;
    try {
      await createTask({ workspaceId, data }).unwrap();
      toast.success("Task created successfully");
      reset();
      dispatch(hideCreateTask());
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    }
  }

  return (
    <Dialog
      open={isCreateTaskOpen}
      onOpenChange={() => dispatch(hideCreateTask())}
    >
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mb-4">
              <TaskSvg width={20} /> Create New Task
            </DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
            <div className="my-5">
              <Field>
                <FieldLabel htmlFor="task-title">
                  Task title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="task-title"
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Update API documentation"
                />
                {errors.title?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.title?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="priority">
                  Priority <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(value) =>
                    setValue("priority", value as CreateTask["priority"])
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.priority?.message}
                  </FieldDescription>
                )}
              </Field>

              <TeamFieldByPermission
                onChange={(val) => setValue("teamId", val)}
                error={errors.teamId?.message}
              />

              <Field className="mt-4">
                <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                <Input id="dueDate" type="date" {...register("dueDate")} />
                {errors.dueDate?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.dueDate?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="**Objective:** What needs to be done?&#10;**Acceptance Criteria:** How do we know it's complete?&#10;&#10;Markdown supported."
                  rows={4}
                />
                <FieldDescription>
                  Supports Markdown formatting
                </FieldDescription>
                {errors.description?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.description?.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </div>
          <DialogFooter className="flex gap-2 items-center justify-end mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(hideCreateTask())}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex gap-2 items-center justify-center"
              disabled={isLoading}
            >
              Create Task <CheckCircle />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
