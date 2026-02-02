import OnboardingForm from "./_components/multi-step-form/OnboardingForm";
import { Timezone, timezoneSchema } from "@/schemas/common/timezoneSchema";
import { normalizeTimezone } from "@/utils/normalizeTimezone";

async function Page() {
  // Auto-detect user's timezone
  const detectedTimezone = normalizeTimezone(
    (() => {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    })(),
  );

  const resData = await timezoneSchema.safeParseAsync(detectedTimezone);

  return (
    <div>
      <OnboardingForm
        detectedTimezone={
          resData.error ? ("UTC" as Timezone) : (detectedTimezone as Timezone)
        }
      />
    </div>
  );
}

export default Page;
