import type { Request, Response } from "express";

export const messages = (_: Request, res: Response) => {
  res.send("reached messages");
};
