import { Button } from "@/components/ui/button";
import { Control, Controller } from "react-hook-form";
import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { OnboardingData } from "@/schemas/onboardingSchema";
import SimpleCard from "@/components/shared/SimpleCard";
import { Spinner } from "@/components/ui/spinner";

interface CreateWorkspaceStep3Props {
  control: Control<OnboardingData>;
  goBack: () => void;
  isSubmitting: boolean;
}

function CreateWorkspaceStep3({
  control,
  goBack,
  isSubmitting,
}: CreateWorkspaceStep3Props) {
  const { watch } = useFormContext();
  const selectedPlan = watch("plan");

  return (
    <div className="w-full">
      <h4 className="text-2xl font-bold text-center">Choose your plan</h4>
      <p className="text-secondary pt-1 text-center">
        Select the plan that best fits your needs
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="plan"
          control={control}
          render={({ field }) => (
            <>
              <SimpleCard
                className="p-0!"
                onClick={() => {
                  if (!isSubmitting) field.onChange("free");
                }}
              >
                <div
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    field.value === "free"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Free</h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl font-bold">₹0</span>
                      <span className="text-secondary ml-2">/ forever</span>
                    </div>
                    <p className="text-secondary text-sm">
                      Perfect for trying out OPSIGNAL for personal use.
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">5 Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">5 Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">100Mb Storage</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="line-through text-sm">
                        Custom Branding
                      </span>
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
              <SimpleCard
                className="p-0!"
                onClick={() => {
                  if (!isSubmitting) field.onChange("premium");
                }}
              >
                <div
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    field.value === "premium"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-0.5 rounded-full text-xs font-medium">
                      MOST POPULAR
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Premium</h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl font-bold">₹99</span>
                      <span className="text-secondary ml-2">/ one-time</span>
                    </div>
                    <p className="text-secondary text-sm">
                      For power users who need complete control.
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Unlimited Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Unlimited Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">500MB Storage</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Custom Branding</span>
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

      <div className="w-full flex justify-between mt-6">
        <Button
          onClick={goBack}
          variant={"outline"}
          type="button"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button className="ml-auto" type="submit" disabled={isSubmitting}>
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

export default CreateWorkspaceStep3;
