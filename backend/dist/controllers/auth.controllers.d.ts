import type { Request, Response } from "express";
export declare const signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (_: Request, res: Response) => void;
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controllers.d.ts.map