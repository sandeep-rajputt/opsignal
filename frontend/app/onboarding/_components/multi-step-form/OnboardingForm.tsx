"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import OnboardingStep1 from "@/app/onboarding/_components/multi-step-form/OnboardingStep1";
import OnboardingStep2 from "@/app/onboarding/_components/multi-step-form/OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import { Timezone } from "@/schemas/common/timezoneSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import onboardingSchema, {
  type OnboardingData,
} from "@/schemas/onboardingSchema";

function OnboardingForm({ detectedTimezone }: { detectedTimezone: Timezone }) {
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      timezone: detectedTimezone,
    },
    reValidateMode: "onBlur",
  });
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);

  async function handleStep1Submit() {
    const isValid = await methods.trigger([
      "workspaceName",
      "workspaceDescription",
    ]);

    if (isValid) {
      setStep(2);
    }
  }

  async function handleStep2Submit() {
    const isValid = await methods.trigger(["teamName", "timezone"]);

    if (isValid) {
      setStep(3);
    }
  }

  function onSubmit(data: OnboardingData) {
    console.log(data);
  }

  return (
    <div className="mx-auto py-10 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <Field className="w-full">
          <FieldLabel htmlFor="form-progress">
            {step === 1 && (
              <>
                <span>Workspace details</span>
                <span className="ml-auto">Step 1 of 3</span>
              </>
            )}
            {step === 2 && (
              <>
                <span>Team & Timezone</span>
                <span className="ml-auto">Step 2 of 3</span>
              </>
            )}
            {step === 3 && (
              <>
                <span>Workspace plan</span>
                <span className="ml-auto">Step 3 of 3</span>
              </>
            )}
            {step === "success" && (
              <>
                <span>Redirecting...</span>
                <span className="ml-auto">All steps completed</span>
              </>
            )}
          </FieldLabel>

          <Progress
            value={step === 1 ? 0 : step === 2 ? 33 : step === 3 ? 66 : 100}
            id="form-progress"
          />
        </Field>
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="mt-10 w-full"
        >
          {step === 1 && (
            <OnboardingStep1
              nameRegister={methods.register("workspaceName")}
              workspaceNameError={
                methods.formState.errors.workspaceName?.message as
                  | string
                  | undefined
              }
              descriptionRegister={methods.register("workspaceDescription")}
              workspaceDescError={
                methods.formState.errors.workspaceDescription?.message as
                  | string
                  | undefined
              }
              goNext={handleStep1Submit}
            />
          )}

          {step === 2 && (
            <OnboardingStep2
              teamNameRegister={methods.register("teamName")}
              control={methods.control}
              goBack={() => setStep(1)}
              teamNameError={
                methods.formState.errors.teamName?.message as string | undefined
              }
              timezoneErrror={
                methods.formState.errors.timezone?.message as string | undefined
              }
              goNext={handleStep2Submit}
            />
          )}

          {step === 3 && (
            <OnboardingStep3
              control={methods.control}
              goBack={() => setStep(2)}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}

export default OnboardingForm;
