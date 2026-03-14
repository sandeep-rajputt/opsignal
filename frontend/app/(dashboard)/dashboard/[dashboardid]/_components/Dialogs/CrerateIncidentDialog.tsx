"use client";

import { hideCreateIncident } from "@/Store/slice/dialogsSlice";
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
import IncidentSvg from "@/svg/IncidentSvg";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createIncidentSchema, {
  CreateIncident,
} from "@/schemas/createIncidentSchema";

function CrerateIncidentDialog() {
  const dispatch = useAppDispatch();
  const isCreateIncidentOpen = useAppSelector(
    (state) => state.dialogs.createIncident,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateIncident>({
    resolver: zodResolver(createIncidentSchema),
  });

  function onSubmit(data: CreateIncident) {
    console.log(data);
  }

  return (
    <Dialog
      open={isCreateIncidentOpen}
      onOpenChange={() => dispatch(hideCreateIncident())}
    >
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IncidentSvg width={20} /> Declare New Incident
            </DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar max-h-[80vh] overflow-y-auto">
            <div className="my-5">
              <Field>
                <FieldLabel htmlFor="input-demo-api-key">
                  Incident title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="input-demo-api-key"
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Database Connection Timeout in US-EAST-I"
                />
                {errors.title?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.title?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="severity">
                  Severity <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(value) =>
                    setValue("severity", value as CreateIncident["severity"])
                  }
                  value={watch("severity")}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.severity?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.severity?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="teamId">
                  Team <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(value) => setValue("teamId", value)}
                  value={watch("teamId")}
                >
                  <SelectTrigger id="teamId">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team-1">Team 1</SelectItem>
                    <SelectItem value="team-2">Team 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.teamId?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.teamId?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="commanderId">
                  Incident Commander <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(value) => setValue("commanderId", value)}
                  value={watch("commanderId")}
                >
                  <SelectTrigger id="commanderId">
                    <SelectValue placeholder="Select incident commander" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commander-1">Commander 1</SelectItem>
                    <SelectItem value="commander-2">Commander 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.commanderId?.message && (
                  <FieldDescription className="text-destructive">
                    {errors.commanderId?.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="mt-4">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="**What happened?** Describe the incident in detail. Markdown supported."
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
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(hideCreateIncident())}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex gap-2 items-center justify-center"
            >
              Declare Incident <Rocket />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CrerateIncidentDialog;
