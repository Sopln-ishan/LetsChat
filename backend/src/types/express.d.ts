import type mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: mongoose.Document;
    }
  }
}
