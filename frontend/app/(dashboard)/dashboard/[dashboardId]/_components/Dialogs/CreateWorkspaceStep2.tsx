import { InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { OnboardingData } from "@/schemas/onboardingSchema";
import SelectTimezone from "@/components/rhf_inputs/SelectTimezone";

interface CreateWorkspaceStep2Props {
  teamNameRegister: InputHTMLAttributes<HTMLInputElement>;
  control: Control<OnboardingData>;
  teamNameError?: string;
  timezoneErrror?: string;
  goBack: () => void;
  goNext: () => void;
}

function CreateWorkspaceStep2({
  teamNameRegister,
  teamNameError,
  timezoneErrror,
  control,
  goBack,
  goNext,
}: CreateWorkspaceStep2Props) {
  return (
    <div className="w-full">
      <h4 className="text-2xl font-bold">Tell us more</h4>
      <p className="text-secondary pt-1">
        This helps us customize your workspace experience.
      </p>
      <div className="mt-6 flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="team-name">Team Name</FieldLabel>
          <Input
            id="team-name"
            {...teamNameRegister}
            placeholder="e.g. Engineering Alpha"
          />
          {teamNameError && (
            <FieldDescription className="text-destructive">
              {teamNameError}
            </FieldDescription>
          )}
        </Field>
        <SelectTimezone<OnboardingData>
          control={control}
          error={timezoneErrror}
          name="timezone"
        />
      </div>
      <div className="w-full flex justify-between mt-6">
        <Button onClick={goBack} variant={"outline"} type="button">
          Back
        </Button>
        <Button className="ml-auto" onClick={goNext} type="button">
          Next
        </Button>
      </div>
    </div>
  );
}

export default CreateWorkspaceStep2;
