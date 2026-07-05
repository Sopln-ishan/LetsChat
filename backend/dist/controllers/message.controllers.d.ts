import type { Request, Response } from "express";
export declare const getAllContacts: (req: Request, res: Response) => Promise<void>;
export declare const getAllChatPartners: (req: Request, res: Response) => Promise<void>;
export declare const getMessagesByUserId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendMessage: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=message.controllers.d.ts.map