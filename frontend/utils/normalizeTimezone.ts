export const normalizeTimezone = (tz: string): string => {
  const aliases: Record<string, string> = {
    // India
    "Asia/Calcutta": "Asia/Kolkata",

    // Vietnam
    "Asia/Saigon": "Asia/Ho_Chi_Minh",

    // Nepal
    "Asia/Katmandu": "Asia/Kathmandu",

    // Myanmar
    "Asia/Rangoon": "Asia/Yangon",

    // Ukraine
    "Europe/Kiev": "Europe/Kyiv",

    // Argentina
    "America/Buenos_Aires": "America/Argentina/Buenos_Aires",

    // Greenland
    "America/Godthab": "America/Nuuk",

    // China (merged zones)
    "Asia/Chongqing": "Asia/Shanghai",
    "Asia/Harbin": "Asia/Shanghai",
    "Asia/Chungking": "Asia/Shanghai",
  };

  return aliases[tz] || tz;
};
