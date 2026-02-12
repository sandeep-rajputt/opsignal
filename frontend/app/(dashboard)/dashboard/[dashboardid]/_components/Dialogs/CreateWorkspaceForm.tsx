"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import CreateWorkspaceStep1 from "./CreateWorkspaceStep1";
import CreateWorkspaceStep2 from "./CreateWorkspaceStep2";
import CreateWorkspaceStep3 from "./CreateWorkspaceStep3";
import { Timezone } from "@/schemas/common/timezoneSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import onboardingSchema, {
  type OnboardingData,
} from "@/schemas/onboardingSchema";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceMutation } from "@/Store/api/createWorkspaceApi/createWorkspaceApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/Store/api/paymentApi/paymentApi";
import { loadRazorpayScript, openRazorpay } from "@/utils/razorpay";
import { toast } from "sonner";
import isApiError from "@/utils/isApiError";
import { useAppDispatch } from "@/Store/hooks";
import { hideAddNewWorkspace } from "@/Store/slice/dialogsSlice";

function CreateWorkspaceForm({
  detectedTimezone,
}: {
  detectedTimezone: Timezone;
}) {
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      timezone: detectedTimezone,
    },
    reValidateMode: "onBlur",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createWorkspace] = useCreateWorkspaceMutation();
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
          dispatch(hideAddNewWorkspace());
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
                dispatch(hideAddNewWorkspace());
                router.push(`/dashboard/${workspaceId}`);
              } catch (error) {
                console.log(error);
                toast.error("Payment verification failed");
                dispatch(hideAddNewWorkspace());
                router.push(`/dashboard/${workspaceId}`);
              }
            },
            theme: {
              color: "#3b82f6",
            },
            modal: {
              ondismiss: () => {
                toast.info("Payment cancelled. You can upgrade later.");
                dispatch(hideAddNewWorkspace());
                router.push(`/dashboard/${workspaceId}`);
              },
            },
          });
        } catch (error) {
          console.log(error);
          toast.error("Failed to create payment order");
          dispatch(hideAddNewWorkspace());
          router.push(`/dashboard/${workspaceId}`);
        }
      } else {
        toast.success("Workspace created successfully");
        dispatch(hideAddNewWorkspace());
        router.push(`/dashboard/${workspaceId}`);
      }
    } catch (error) {
      const apiError = isApiError(error);
      toast.error(
        apiError?.message || "Something went wrong, please try again later",
      );
    }
  }

  return (
    <div className="py-6 flex flex-col items-center">
      <div className="w-full">
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
          </FieldLabel>

          <Progress
            value={step === 1 ? 0 : step === 2 ? 33 : 66}
            id="form-progress"
          />
        </Field>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-6 w-full">
          {step === 1 && (
            <CreateWorkspaceStep1
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
            <CreateWorkspaceStep2
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
            <CreateWorkspaceStep3
              control={methods.control}
              goBack={() => setStep(2)}
              isSubmitting={methods.formState.isSubmitting}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}

export default CreateWorkspaceForm;
