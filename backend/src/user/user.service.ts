import { createHash, hashCompare } from "../utils/hash.js";
import type { CreateUser, LoginUser, LoginUserService } from "./user.types.js";
import {
  checkUser,
  createUser as createUserModel,
  verifyUser as verifyUserModel,
} from "./users.model.js";

export async function createUser(data: CreateUser) {
  const hashPassword = await createHash(data.password);
  return await createUserModel({
    name: data.name,
    hashPassword,
    email: data.email,
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
