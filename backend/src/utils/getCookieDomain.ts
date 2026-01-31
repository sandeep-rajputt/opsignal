import config from "../config/config.js";

function getCookieDomain() {
  if (config.ENV !== "production") return undefined;
  return config.COOKIE_DOMAIN;
}

export default getCookieDomain;
