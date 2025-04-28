import { Router } from "express";

const router = Router();
import { register, login, logout } from "../controllers/authController.js";
import { validateRegisterInput } from "../middlewares/validationMiddleware.js";
import { validateLoginInput } from "../middlewares/validationMiddleware.js";
router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.get("/logout", logout);

export default router;
