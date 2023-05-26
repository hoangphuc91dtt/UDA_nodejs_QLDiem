import { Router } from "express";
import authenController from "../controllers/authen_controller";

const router = Router();

router.post("/login", authenController.login);
router.post("/logout", authenController.logout);

export default router;
