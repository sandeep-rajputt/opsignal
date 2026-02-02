import { z } from "zod";

export const timezoneSchema = z.enum([
  // UTC
  "UTC",

  // Americas
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "America/Buenos_Aires", // legacy
  "America/Nuuk",
  "America/Godthab", // legacy

  // Europe
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Athens",
  "Europe/Istanbul",
  "Europe/Moscow",
  "Europe/Kyiv",
  "Europe/Kiev", // legacy

  // Africa
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Nairobi",

  // Middle East
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Jerusalem",

  // Asia
  "Asia/Kolkata",
  "Asia/Calcutta", // legacy
  "Asia/Karachi",
  "Asia/Dhaka",
  "Asia/Kathmandu",
  "Asia/Katmandu", // legacy
  "Asia/Yangon",
  "Asia/Rangoon", // legacy
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Chongqing", // legacy
  "Asia/Harbin", // legacy
  "Asia/Chungking", // legacy
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Ho_Chi_Minh",
  "Asia/Saigon", // legacy

  // Australia & Pacific
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "Pacific/Auckland",
  "Pacific/Fiji",
]);

export type Timezone = z.infer<typeof timezoneSchema>;
