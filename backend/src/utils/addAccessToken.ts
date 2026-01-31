import { type Response } from "express";
import { createToken } from "./jwt.js";
import config from "../config/config.js";
import getCookieDomain from "./getCookieDomain.js";

function addAccessToken({
  res,
  id,
  token,
}: {
  res: Response;
  id: string | null;
  token: string | null;
}) {
  const accessToken =
    token ||
    createToken({
      key: config.ACCESS_TOKEN_SECRET,
      data: { id },
      expiresIn: "15m",
    });
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60 * 15,
    domain: getCookieDomain(),
    path: "/",
  });
  return;
}

export default addAccessToken;
