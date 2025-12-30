import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/get-user-playlist/:userId").get(verifyJWT, getUserPlaylists);

export default router;
