import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingStep1Props {
  nameRegister: InputHTMLAttributes<HTMLInputElement>;
  descriptionRegister: TextareaHTMLAttributes<HTMLTextAreaElement>;
  workspaceNameError?: string;
  workspaceDescError?: string;
  goNext: () => void;
}

function OnboardingStep1({
  nameRegister,
  descriptionRegister,
  workspaceNameError,
  workspaceDescError,
  goNext,
}: OnboardingStep1Props) {
  return (
    <div className="max-w-xl w-full mx-auto">
      <h4 className="text-4xl font-bold">Create your workspace</h4>
      <p className="text-secondary pt-1">Workspace Identity</p>
      <div className="mt-10 flex flex-col gap-5">
        <Field>
          <FieldLabel>Workspace Name</FieldLabel>
          <Input {...nameRegister} placeholder="eg. Acme Corp" />
          {workspaceNameError && (
            <FieldDescription className="text-destructive">
              {workspaceNameError}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
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

      <div className="w-full flex justify-end mt-10">
        <Button className="ml-auto" size={"lg"} onClick={goNext} type="button">
          Next
        </Button>
      </div>
    </div>
  );
}

export default OnboardingStep1;
