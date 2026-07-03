import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied() && decision.reason.isBot()) {
            return res.status(403).json({ message: "Bot access denied" });
        }
        else if (decision.isDenied() && decision.reason.isRateLimit()) {
            return res
                .status(429)
                .json({ message: "Too many requests, try again in a minute" });
        }
        else if (decision.isDenied()) {
            return res.status(403).json({
                message: "Access denied for security reasons",
            });
        }
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected",
            });
        }
        next();
    }
    catch (error) {
        console.error("Arcjet protection error", error);
        next();
    }
};
//# sourceMappingURL=arcjet.middleware.js.map