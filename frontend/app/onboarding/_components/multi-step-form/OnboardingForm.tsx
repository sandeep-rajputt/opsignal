"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import OnboardingStep1 from "@/app/onboarding/_components/multi-step-form/OnboardingStep1";
import OnboardingStep2 from "@/app/onboarding/_components/multi-step-form/OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import { Timezone } from "@/schemas/common/timezoneSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import onboardingSchema, {
  type OnboardingData,
} from "@/schemas/onboardingSchema";
import { useRouter } from "next/navigation";
import { useCreatePrimaryWorkspaceMutation } from "@/Store/api/createPrimaryWorkspaceApi/createPrimaryWorkspaceApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/Store/api/paymentApi/paymentApi";
import { loadRazorpayScript, openRazorpay } from "@/utils/razorpay";
import { toast } from "sonner";

function OnboardingForm({ detectedTimezone }: { detectedTimezone: Timezone }) {
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      timezone: detectedTimezone,
    },
    reValidateMode: "onBlur",
  });
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | "success" | "error">(1);
  const [createWorkspace] = useCreatePrimaryWorkspaceMutation();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

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

  async function onSubmit(data: OnboardingData) {
    try {
      const res = await createWorkspace(data).unwrap();
      const workspaceId = res.data.id;

      if (data.plan === "premium") {
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          toast.error("Failed to load payment gateway");
          router.push(`/dashboard/${workspaceId}`);
          return;
        }

        try {
          const orderRes = await createOrder({
            workspaceId,
            plan: "premium",
          }).unwrap();

          openRazorpay({
            key: orderRes.data.key,
            amount: orderRes.data.amount,
            currency: orderRes.data.currency,
            name: "OPSIGNAL",
            description: "Premium Workspace Plan",
            order_id: orderRes.data.orderId,
            handler: async (response) => {
              try {
                await verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  workspaceId,
                }).unwrap();

                toast.success("Payment successful! Upgraded to Premium");
                setStep("success");
                router.push(`/dashboard/${workspaceId}`);
              } catch (error) {
                console.log(error);
                toast.error("Payment verification failed");
                router.push(`/dashboard/${workspaceId}`);
              }
            },
            theme: {
              color: "#3b82f6",
            },
            modal: {
              ondismiss: () => {
                toast.info("Payment cancelled. You can upgrade later.");
                router.push(`/dashboard/${workspaceId}`);
              },
            },
          });
        } catch (error) {
          console.log(error);
          toast.error("Failed to create payment order");
          router.push(`/dashboard/${workspaceId}`);
        }
      } else {
        setStep("success");
        toast.success("Workspace created 🎉");
        router.push(`/dashboard/${workspaceId}`);
      }
    } catch (err) {
      console.log(err);
      setStep("error");
    }
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
            {step === "error" && (
              <>
                <span>Something went wrong</span>
                <span className="ml-auto">Please try again</span>
              </>
            )}
          </FieldLabel>

          <Progress
            value={
              step === 1
                ? 0
                : step === 2
                  ? 33
                  : step === 3
                    ? 66
                    : step === "success"
                      ? 100
                      : 66
            }
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
              isSubmitting={methods.formState.isSubmitting}
            />
          )}
        </form>
      </FormProvider>
      {step === "success" && (
        <div className="max-w-xl w-full mx-auto text-center mt-10">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="text-4xl font-bold mb-4">Workspace Created!</h4>
            <p className="text-secondary text-lg">
              Your workspace is being set up. You&apos;ll be redirected to your
              dashboard in a moment.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-secondary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Setting up your workspace...</span>
          </div>
        </div>
      )}
      {step === "error" && (
        <div className="max-w-xl w-full mx-auto text-center mt-10">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h4 className="text-4xl font-bold mb-4">
              Oops! Something went wrong
            </h4>
            <p className="text-secondary text-lg mb-8">
              We couldn&apos;t create your workspace. Please check your
              connection and try again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setStep(3)}
              variant="outline"
              size="lg"
              type="button"
            >
              Go Back
            </Button>
            <Button
              onClick={() => methods.handleSubmit(onSubmit)()}
              size="lg"
              type="button"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
      {step === "error" && <div></div>}
    </div>
  );
}

export default OnboardingForm;
