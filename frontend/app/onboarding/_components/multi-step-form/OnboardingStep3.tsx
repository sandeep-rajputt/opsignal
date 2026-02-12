import { Button } from "@/components/ui/button";
import { Control, Controller } from "react-hook-form";
import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { OnboardingData } from "@/schemas/onboardingSchema";
import SimpleCard from "@/components/shared/SimpleCard";
import { Spinner } from "@/components/ui/spinner";

interface OnboardingStep3Props {
  control: Control<OnboardingData>;
  goBack: () => void;
  isSubmitting: boolean;
}

function OnboardingStep3({
  control,
  goBack,
  isSubmitting,
}: OnboardingStep3Props) {
  const { watch } = useFormContext();
  const selectedPlan = watch("plan");

  return (
    <div className="max-w-4xl w-full mx-auto">
      <h4 className="text-4xl font-bold text-center">Choose your plan</h4>
      <p className="text-secondary pt-1 text-center">
        Select the plan that best fits your needs
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="plan"
          control={control}
          render={({ field }) => (
            <>
              {/* Free Plan */}
              <SimpleCard
                className="p-0!"
                onClick={() => {
                  if (!isSubmitting) field.onChange("free");
                }}
              >
                <div
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    field.value === "free"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                    <div className="flex items-baseline mb-3">
                      <span className="text-4xl font-bold">₹0</span>
                      <span className="text-secondary ml-2">/ forever</span>
                    </div>
                    <p className="text-secondary">
                      Perfect for trying out OPSIGNAL for personal use.
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>5 Members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>5 Teams</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>100Mb Storage</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      <span className="line-through">Custom Branding</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant={field.value === "free" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => {
                      field.onChange("free");
                    }}
                  >
                    Select Free
                  </Button>
                </div>
              </SimpleCard>
              {/* Premium Plan */}
              <SimpleCard
                className="p-0!"
                onClick={() => {
                  if (!isSubmitting) field.onChange("premium");
                }}
              >
                <div
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    field.value === "premium"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      MOST POPULAR
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Premium</h3>
                    <div className="flex items-baseline mb-3">
                      <span className="text-4xl font-bold">₹19</span>
                      <span className="text-secondary ml-2">/ one-time</span>
                    </div>
                    <p className="text-secondary">
                      For power users who need complete control.
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Unlimited Members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Unlimited Teams</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span>500MB Storage</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Custom Branding</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant={field.value === "premium" ? "default" : "default"}
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => field.onChange("premium")}
                  >
                    Select Premium
                  </Button>
                </div>
              </SimpleCard>
            </>
          )}
        />
      </div>

      <div className="w-full flex justify-between mt-10">
        <Button
          onClick={goBack}
          variant={"outline"}
          size={"lg"}
          type="button"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          className="ml-auto"
          size={"lg"}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Creating Workspace <Spinner />
            </>
          ) : selectedPlan === "premium" ? (
            "Continue to Payment"
          ) : (
            "Create Free Workspace"
          )}
        </Button>
      </div>
    </div>
  );
}

export default OnboardingStep3;
