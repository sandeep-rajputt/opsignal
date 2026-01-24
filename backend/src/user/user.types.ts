import { createUserSchema, loginUserSchema } from "./user.validation.js";
import { z } from "zod";

export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

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
}

export type LoginUserService =
  | { success: false; message: string }
  | { success: true; id: string };
