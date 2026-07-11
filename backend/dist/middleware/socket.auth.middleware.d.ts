import type { Socket } from "socket.io";
declare module "socket.io" {
    interface Socket {
        user?: any;
        userId?: string;
    }
}
export declare const socketAuthMiddleware: (socket: Socket, next: (err?: Error) => void) => Promise<void>;
//# sourceMappingURL=socket.auth.middleware.d.ts.map