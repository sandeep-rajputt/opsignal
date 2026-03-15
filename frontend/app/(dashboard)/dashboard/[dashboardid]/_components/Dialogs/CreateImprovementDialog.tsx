"use client";

import { hideCreateImprovement } from "@/Store/slice/dialogsSlice";
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
import ImprovementSvg from "@/svg/ImprovementSvg";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createImprovementSchema, {
  CreateImprovement,
} from "@/schemas/createImprovementSchema";
import { TeamFieldByPermission } from "../others/CreateWorkTeamField";
import { useCreateImprovementMutation } from "@/Store/api/createImprovementApi/createImprovementApi";
import { toast } from "sonner";

function CreateImprovementDialog() {
  const dispatch = useAppDispatch();
  const isCreateImprovementOpen = useAppSelector(
    (state) => state.dialogs.createImprovement,
  );
  const workspaceId = useAppSelector(
    (state) => state.currentWorkspace.workspace?.id,
  );

  const [createImprovement, { isLoading }] = useCreateImprovementMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateImprovement>({
    resolver: zodResolver(createImprovementSchema),
  });

  async function onSubmit(data: CreateImprovement) {
    if (!workspaceId) return;
    try {
      await createImprovement({ workspaceId, data }).unwrap();
      toast.success("Improvement created successfully");
      reset();
      dispatch(hideCreateImprovement());
    } catch (error) {
      console.log(error);
      toast.error("Failed to create improvement");
    }
  }

  return (
    <Dialog
      open={isCreateImprovementOpen}
      onOpenChange={() => dispatch(hideCreateImprovement())}
    >
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mb-4">
              <ImprovementSvg width={20} /> Create New Improvement
            </DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
            <div className="my-5">
              <Field>
                <FieldLabel htmlFor="improvement-title">
                  Improvement title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="improvement-title"
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Implement automated testing pipeline"
                />
                {errors.title?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.title?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(value) =>
                    setValue("category", value as CreateImprovement["category"])
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.category?.message}
                  </FieldDescription>
                )}
              </Field>

              <TeamFieldByPermission
                onChange={(val) => setValue("teamId", val)}
                error={errors.teamId?.message}
              />

              <Field className="mt-4">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="**Current State:** What's the problem?&#10;**Proposed Solution:** How can we improve it?&#10;&#10;Markdown supported."
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

              <Field className="mt-4">
                <FieldLabel htmlFor="expectedImpact">
                  Expected Impact
                </FieldLabel>
                <Textarea
                  id="expectedImpact"
                  {...register("expectedImpact")}
                  placeholder="**Benefits:** Reduced response time, improved efficiency, etc.&#10;**Metrics:** How will we measure success?&#10;&#10;Markdown supported."
                  rows={3}
                />
                <FieldDescription>
                  Supports Markdown formatting
                </FieldDescription>
                {errors.expectedImpact?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.expectedImpact?.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </div>
          <DialogFooter className="flex gap-2 items-center justify-end mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(hideCreateImprovement())}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex gap-2 items-center justify-center"
              disabled={isLoading}
            >
              Create Improvement <Lightbulb />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateImprovementDialog;
