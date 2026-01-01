import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  playListIdParamSchema,
  getPlayListQuerySchema,
  addAndRemoveVideoToPlaylistParamSchema,
} from "../validations/playlist.validation.js";

const router = Router();

// Apply JWT authentication to all video routes
router.use(verifyJWT);

// Create new playlist
router.route("/").post(validate(createPlaylistSchema), createPlaylist);

// Fetch all playlist (authenticated user)
router
  .route("/")
  .get(validate(getPlayListQuerySchema, "query"), getUserPlaylists);

// Fetch single playlist by ID
router
  .route("/:playlistId")
  .get(validate(playListIdParamSchema, "params"), getPlaylistById);

// update playlist
router
  .route("/:playlistId")
  .patch(
    validate(updatePlaylistSchema),
    validate(playListIdParamSchema, "params"),
    updatePlaylist
  );

// delete playlist
router
  .route("/:playlistId")
  .delete(validate(playListIdParamSchema, "params"), deletePlaylist);

// Add video to playlis by playlist id and video id
router.patch(
  "/:playlistId/videos/:videoId",
  validate(addAndRemoveVideoToPlaylistParamSchema, "params"),
  addVideoToPlaylist
);

// Remove video from playlistwith playlistId and video id
router.delete(
  "/:playlistId/videos/:videoId",
  validate(addAndRemoveVideoToPlaylistParamSchema, "params"),
  removeVideoFromPlaylist
);

export default router;
