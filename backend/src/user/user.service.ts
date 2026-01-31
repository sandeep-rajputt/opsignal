import type { Request } from "express";
import { createHash, hashCompare } from "../utils/hash.js";
import type { CreateUser, LoginUser, LoginUserService } from "./user.types.js";
import {
  checkUser,
  checkUserExistById,
  createUser as createUserModel,
  createUserSession,
  getUserIdByEmail,
  verifyUser as verifyUserModel,
  updateUserPassword,
} from "./users.model.js";

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
    req.useragent.browser ||
    req.useragent.os ||
    (req.useragent.isMobile ? "Mobile" : "Desktop");

  return await createUserSession({
    ipAddress,
    device,
    userId: id,
  });
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
  if (!resData.emailverified) {
    return { success: false, message: "Please verify your email to login" };
  }

  const match = await hashCompare(password, resData.passwordhash);

  if (match) {
    return { success: true, id: resData.id };
  } else {
    return { success: false, message: "Invalid password" };
  }
}

export async function getUserIdByEmailService(email: string) {
  return await getUserIdByEmail(email);
}

export async function checkUserExistByIdService(id: string) {
  return await checkUserExistById(id);
}

export async function verifyUser(id: string) {
  await verifyUserModel(id);
  return;
}

export async function changeUserPasswordService(
  id: string,
  newPassword: string,
) {
  const hashedPassword = await createHash(newPassword);
  await updateUserPassword(id, hashedPassword);
  return;
}
