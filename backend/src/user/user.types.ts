import {
  createUserSchema,
  loginUserSchema,
  changeUserPasswordSchema,
} from "./user.validation.js";
import { z } from "zod";

export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type ChangeUserPassword = z.infer<typeof changeUserPasswordSchema>;

export interface CreateUserQueryIncommingData {
  name: string;
  email: string;
  hashPassword: string;
}

export interface CreateUserQueryOutgoingData {
  id: string;
}

export interface CheckUserQueryResponse {
  email: string;
  id: string;
  passwordhash: string;
  emailverified: boolean;
}

export type LoginUserService =
  | { success: false; message: string }
  | { success: true; id: string };

export interface CreateUserSession {
  userId: string;
  ipAddress: string | null;
  device: string;
}
