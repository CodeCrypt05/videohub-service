import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { validate } from "../middleware/validate.js";
import {
  getChannelStatsParamsSchema,
  getChannelVideosParamsSchema,
} from "../validations/dashboard.validation.js";

const router = Router();

// Apply JWT authentication to all video routes
router.use(verifyJWT);

router.get(
  "/:channelId",
  validate(getChannelStatsParamsSchema, "params"),
  getChannelStats
);
router.get(
  "/:channelId/videos",
  validate(getChannelVideosParamsSchema, "params"),
  getChannelVideos
);

export default router;
