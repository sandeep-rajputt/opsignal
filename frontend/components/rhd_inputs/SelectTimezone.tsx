import { Controller, Control, FieldValues, Path } from "react-hook-form";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectTimezoneProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

function SelectTimezone<T extends FieldValues>({
  control,
  name,
  error,
}: SelectTimezoneProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="timezone">Your Timezone</FieldLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {/* UTC */}
              <SelectItem value="UTC">UTC (GMT+0:00)</SelectItem>

              {/* Americas */}
              <SelectItem value="America/New_York">
                Eastern Time (GMT-5:00)
              </SelectItem>
              <SelectItem value="America/Chicago">
                Central Time (GMT-6:00)
              </SelectItem>
              <SelectItem value="America/Denver">
                Mountain Time (GMT-7:00)
              </SelectItem>
              <SelectItem value="America/Los_Angeles">
                Pacific Time (GMT-8:00)
              </SelectItem>
              <SelectItem value="America/Anchorage">
                Alaska (GMT-9:00)
              </SelectItem>
              <SelectItem value="Pacific/Honolulu">
                Hawaii (GMT-10:00)
              </SelectItem>
              <SelectItem value="America/Toronto">
                Toronto (GMT-5:00)
              </SelectItem>
              <SelectItem value="America/Vancouver">
                Vancouver (GMT-8:00)
              </SelectItem>
              <SelectItem value="America/Mexico_City">
                Mexico City (GMT-6:00)
              </SelectItem>
              <SelectItem value="America/Sao_Paulo">
                São Paulo (GMT-3:00)
              </SelectItem>
              <SelectItem value="America/Argentina/Buenos_Aires">
                Buenos Aires (GMT-3:00)
              </SelectItem>

              {/* Europe */}
              <SelectItem value="Europe/London">London (GMT+0:00)</SelectItem>
              <SelectItem value="Europe/Paris">Paris (GMT+1:00)</SelectItem>
              <SelectItem value="Europe/Berlin">Berlin (GMT+1:00)</SelectItem>
              <SelectItem value="Europe/Rome">Rome (GMT+1:00)</SelectItem>
              <SelectItem value="Europe/Madrid">Madrid (GMT+1:00)</SelectItem>
              <SelectItem value="Europe/Amsterdam">
                Amsterdam (GMT+1:00)
              </SelectItem>
              <SelectItem value="Europe/Brussels">
                Brussels (GMT+1:00)
              </SelectItem>
              <SelectItem value="Europe/Vienna">Vienna (GMT+1:00)</SelectItem>
              <SelectItem value="Europe/Warsaw">Warsaw (GMT+1:00)</SelectItem>
              <SelectItem value="Europe/Athens">Athens (GMT+2:00)</SelectItem>
              <SelectItem value="Europe/Istanbul">
                Istanbul (GMT+3:00)
              </SelectItem>
              <SelectItem value="Europe/Moscow">Moscow (GMT+3:00)</SelectItem>

              {/* Africa */}
              <SelectItem value="Africa/Cairo">Cairo (GMT+2:00)</SelectItem>
              <SelectItem value="Africa/Johannesburg">
                Johannesburg (GMT+2:00)
              </SelectItem>
              <SelectItem value="Africa/Lagos">Lagos (GMT+1:00)</SelectItem>
              <SelectItem value="Africa/Nairobi">Nairobi (GMT+3:00)</SelectItem>

              {/* Middle East */}
              <SelectItem value="Asia/Dubai">Dubai (GMT+4:00)</SelectItem>
              <SelectItem value="Asia/Riyadh">Riyadh (GMT+3:00)</SelectItem>
              <SelectItem value="Asia/Jerusalem">
                Jerusalem (GMT+2:00)
              </SelectItem>

              {/* Asia */}
              <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
              <SelectItem value="Asia/Karachi">Karachi (GMT+5:00)</SelectItem>
              <SelectItem value="Asia/Dhaka">Dhaka (GMT+6:00)</SelectItem>
              <SelectItem value="Asia/Bangkok">Bangkok (GMT+7:00)</SelectItem>
              <SelectItem value="Asia/Singapore">
                Singapore (GMT+8:00)
              </SelectItem>
              <SelectItem value="Asia/Hong_Kong">
                Hong Kong (GMT+8:00)
              </SelectItem>
              <SelectItem value="Asia/Shanghai">Shanghai (GMT+8:00)</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo (GMT+9:00)</SelectItem>
              <SelectItem value="Asia/Seoul">Seoul (GMT+9:00)</SelectItem>

              {/* Australia & Pacific */}
              <SelectItem value="Australia/Sydney">
                Sydney (GMT+11:00)
              </SelectItem>
              <SelectItem value="Australia/Melbourne">
                Melbourne (GMT+11:00)
              </SelectItem>
              <SelectItem value="Australia/Brisbane">
                Brisbane (GMT+10:00)
              </SelectItem>
              <SelectItem value="Australia/Perth">Perth (GMT+8:00)</SelectItem>
              <SelectItem value="Pacific/Auckland">
                Auckland (GMT+13:00)
              </SelectItem>
              <SelectItem value="Pacific/Fiji">Fiji (GMT+12:00)</SelectItem>
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </Field>
      )}
    />
  );
}

export default SelectTimezone;
