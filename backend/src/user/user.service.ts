import type { Request } from "express";
import { createHash, hashCompare } from "../utils/hash.js";
import type { CreateUser, LoginUser, LoginUserService } from "./user.types.js";
import {
  checkUser,
  createUser as createUserModel,
  createUserSession,
  verifyUser as verifyUserModel,
} from "./users.model.js";
import { v4 as uuidV4 } from "uuid";

export async function createUser(data: CreateUser) {
  const hashPassword = await createHash(data.password);
  const dbRes = await createUserModel({
    name: data.name,
    hashPassword,
    email: data.email,
  });
  return dbRes;
}

export async function createSession({ req, id }: { req: Request; id: string }) {
  const ipAddress = req.ip || null;
  const device =
    req.useragent.browser || req.useragent.os || req.useragent.isMobile
      ? "Mobile"
      : "Desktop";
  const token = uuidV4();
  return await createUserSession({ ipAddress, device, userId: id, token });
}

export async function loginUser(data: LoginUser): Promise<LoginUserService> {
  const { email, password } = data;

  const resData = await checkUser(email);

  if (!resData) {
    return { success: false, message: "User not found" };
  }

  if (!resData.passwordhash) {
    return { success: false, message: "Invalid password" };
  }

  const match = await hashCompare(password, resData.passwordhash);
  if (match) {
    return { success: true, id: resData.id };
  } else {
    return { success: false, message: "Invalid password" };
  }
}

export async function verifyUser(id: string) {
  await verifyUserModel(id);
  return;
}
