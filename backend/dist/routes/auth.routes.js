import express from "express";
import { login, logout, signup, updateUser, } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();
router.use(arcjetProtection);
router.get("/check", protectRoute, (req, res) => {
    res.status(200).json(req.user);
});
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-user", protectRoute, updateUser);
export default router;
//# sourceMappingURL=auth.routes.js.map