import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  contentTweetSchema,
  tweetIdParamsSchema,
} from "../validations/tweet.validation.js";

const router = Router();

// Apply JWT authentication to all tweet routes
router.use(verifyJWT);

router.route("/").post(validate(contentTweetSchema), createTweet);
router.route("/").get(getUserTweets);
router
  .route("/:tweetId")
  .patch(
    validate(tweetIdParamsSchema, "params"),
    validate(contentTweetSchema),
    updateTweet
  );
router
  .route("/:tweetId")
  .delete(validate(tweetIdParamsSchema, "params"), deleteTweet);

export default router;
