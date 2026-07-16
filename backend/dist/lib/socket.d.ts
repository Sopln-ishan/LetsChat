import { Server } from "socket.io";
import http from "http";
declare const app: import("express-serve-static-core").Express;
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const redisClient: import("redis").RedisClientType<{}, {}, {}, 3, {}>;
export declare const getReceiverSocketId: (userId: string) => Promise<string | null>;
export { server, app, io };
//# sourceMappingURL=socket.d.ts.map