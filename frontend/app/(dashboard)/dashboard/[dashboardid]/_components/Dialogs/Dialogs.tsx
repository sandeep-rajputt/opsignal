import LogoutDialog from "./LogoutDialog";
import { normalizeTimezone } from "@/utils/normalizeTimezone";
import { timezoneSchema } from "@/schemas/common/timezoneSchema";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";
import { Timezone } from "@/schemas/common/timezoneSchema";
import AddWorkspaceSlotDialog from "./AddWorkspaceSlotDialog";

async function Dialogs() {
  const detectedTimezone = normalizeTimezone(
    (() => {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    })(),
  );

  const resData = await timezoneSchema.safeParseAsync(detectedTimezone);
  return (
    <>
      <LogoutDialog />
      <CreateWorkspaceDialog
        detectedTimezone={
          resData.error ? ("UTC" as Timezone) : (detectedTimezone as Timezone)
        }
      />
      <AddWorkspaceSlotDialog />
    </>
  );
}

export default Dialogs;
