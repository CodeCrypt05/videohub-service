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

const router = Router();

router.route("/getAllVideos").get(verifyJWT, getAllVideos);
router.route("/publishAVideo").post(
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
  verifyJWT,
  publishAVideo
);
router.route("/:videoId").get(verifyJWT, getVideoById);
router.route("/:videoId").patch(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  updateVideo
);

router.route("/:videoId").delete(verifyJWT, deleteVideo);
router.route("/:videoId/publish").patch(verifyJWT, togglePublishStatus);

export default router;
