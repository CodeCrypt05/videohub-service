import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", healthcheck);

export default router;
