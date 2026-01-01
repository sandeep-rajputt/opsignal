import { createUserSchema, loginUserSchema } from "./user.validation.js";
import { z } from "zod";

export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type CreateUserQueryIncommingData = {
  name: string;
  email: string;
  hashPassword: string;
};

export type CreateUserQueryOutgoingData = {
  id: string;
};

export type ChectUserQueryResponse = {
  email: string;
  id: string;
  passwordhash: string;
};

export type LoginUserService =
  | { success: false; message: string }
  | { success: true; id: string };
