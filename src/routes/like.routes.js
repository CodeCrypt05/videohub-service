import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT authentication to all video routes
router.use(verifyJWT);

// toogle video like
router.route("/:videoId/like").get(toggleVideoLike);
router.route("/:commentId/like").get(toggleVideoLike);
router.route("/:tweetId/like").get(toggleVideoLike);
router.route("/").get(getLikedVideos);

export default router;
