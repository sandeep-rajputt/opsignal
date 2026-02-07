import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateWorkspaceStep1Props {
  nameRegister: InputHTMLAttributes<HTMLInputElement>;
  descriptionRegister: TextareaHTMLAttributes<HTMLTextAreaElement>;
  workspaceNameError?: string;
  workspaceDescError?: string;
  goNext: () => void;
}

function CreateWorkspaceStep1({
  nameRegister,
  descriptionRegister,
  workspaceNameError,
  workspaceDescError,
  goNext,
}: CreateWorkspaceStep1Props) {
  return (
    <div className="w-full">
      <h4 className="text-2xl font-bold">About your workspace</h4>
      <p className="text-secondary pt-1">Workspace Identity</p>
      <div className="mt-6 flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="workspace-name">Workspace Name</FieldLabel>
          <Input
            id="workspace-name"
            {...nameRegister}
            placeholder="eg. Acme Corp"
          />
          {workspaceNameError && (
            <FieldDescription className="text-destructive">
              {workspaceNameError}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="workspace-description">Description</FieldLabel>
          <Textarea
            id="workspace-description"
            {...descriptionRegister}
            placeholder="What is this workspace for? e.g. Design Team collaboration space."
          />
          {workspaceDescError && (
            <FieldDescription className="text-destructive">
              {workspaceDescError}
            </FieldDescription>
          )}
        </Field>
      </div>

      <div className="w-full flex justify-end mt-6">
        <Button className="ml-auto" onClick={goNext} type="button">
          Next
        </Button>
      </div>
    </div>
  );
}

export default CreateWorkspaceStep1;
