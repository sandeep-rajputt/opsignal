// src/@types/express/index.d.ts
import "express-useragent";

declare global {
  namespace Express {
    interface Request {
      useragent: import("express-useragent").Details;
    }
  }
}

export {};
