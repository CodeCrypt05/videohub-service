import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/get-user-tweets").get(verifyJWT, getUserTweets);
router.route("/update-tweet").patch(verifyJWT, updateTweet);
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
