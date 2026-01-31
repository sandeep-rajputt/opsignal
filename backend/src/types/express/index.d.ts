// src/@types/express/index.d.ts
import "express-useragent";

interface User {
  id: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      useragent: import("express-useragent").Details;
      user?: User;
    }
  }
}

export {};
