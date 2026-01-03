import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  videoLikeParamSchema,
  commentLikeParamSchema,
  tweetLikeParamSchema,
  getLikedVideosSchema,
} from "../validations/like.validation.js";

const router = Router();

// Apply JWT authentication to all video routes
router.use(verifyJWT);

// toogle video like
router
  .route("/:videoId/like")
  .get(validate(videoLikeParamSchema, "params"), toggleVideoLike);

// toogle comment like
router
  .route("/:commentId/like")
  .get(validate(commentLikeParamSchema, "params"), toggleCommentLike);

// topgle tweet like
router
  .route("/:tweetId/like")
  .get(validate(tweetLikeParamSchema, "params"), toggleTweetLike);

// get all like video
router
  .route("/liked")
  .get(validate(getLikedVideosSchema, "query"), getLikedVideos);

export default router;
