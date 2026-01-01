import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  createVideoSchema,
  updateVideoSchema,
  videoIdParamSchema,
  getAllVideosQuerySchema,
} from "../validations/video.validation.js";

const router = Router();

// Apply JWT authentication to all video routes
router.use(verifyJWT);

// Fetch all videos (authenticated user)
router.route("/").get(validate(getAllVideosQuerySchema, "query"), getAllVideos);

// Publish a new video (video file + thumbnail)
router.route("/").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  validate(createVideoSchema),
  publishAVideo
);

// Fetch single video by ID
router.route("/:id").get(validate(videoIdParamSchema, "params"), getVideoById);

// Update video details / thumbnail
router.route("/:id").patch(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  validate(updateVideoSchema),
  validate(videoIdParamSchema, "params"),
  updateVideo
);

// Delete a video by ID
router
  .route("/:id")
  .delete(validate(videoIdParamSchema, "params"), deleteVideo);

// Toggle publish/unpublish status
router
  .route("/:id/status")
  .patch(validate(videoIdParamSchema, "params"), togglePublishStatus);

export default router;
