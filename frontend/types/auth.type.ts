type Auth = {
  token: null | string;
  status: "initial" | "pending" | "success" | "failed";
  userId: null | string;
};

export { type Auth };
