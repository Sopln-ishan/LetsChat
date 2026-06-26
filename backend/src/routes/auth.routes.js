import express from "express";
const router = express.Router();
router.get("/api/auth/signup", (req, res) => {
    res.send("You are in sign up page");
});
router.get("/api/auth/login", (req, res) => {
    res.send("You are in login page");
});
router.get("/api/auth/logout", (req, res) => {
    res.send("You are in logout page");
});
export default router;
//# sourceMappingURL=auth.routes.js.map