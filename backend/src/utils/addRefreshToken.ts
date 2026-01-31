import type { Response } from "express";
import { createToken } from "./jwt.js";
import config from "../config/config.js";
import getCookieDomain from "./getCookieDomain.js";

function addRefreshToken({
  res,
  id,
  token,
}: {
  res: Response;
  id: string | null;
  token: string | null;
}) {
  const refreshToken =
    token ||
    createToken({
      key: config.REFRESH_TOKEN_SECRET,
      data: { id },
      expiresIn: "7d",
    });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain: getCookieDomain(),
    path: "/",
  });
  return;
}

export default addRefreshToken;
