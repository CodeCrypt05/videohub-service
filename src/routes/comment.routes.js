import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { validate } from "../middleware/validate.js";
import {
  getVideoCommentsSchema,
  getVideoCommentsParamsSchema,
  addCommentParamsSchema,
  updateCommentParamsSchema,
  deleteCommentParamsSchema,
} from "../validations/comment.validation.js";

const router = Router();

// Apply JWT authentication to all video routes
router.use(verifyJWT);

// GET all comments for a video
router.get(
  "/:videoId",
  validate(getVideoCommentsParamsSchema, "params"),
  validate(getVideoCommentsSchema, "query"),
  getVideoComments
);

// ADD comment to a video
router.post(
  "/:videoId",
  validate(addCommentParamsSchema, "params"),
  addComment
);

// Update and delete comment with comment id
router
  .route("/:commentId")
  .patch(validate(updateCommentParamsSchema, "params"), updateComment)
  .delete(validate(deleteCommentParamsSchema, "params"), deleteComment);

// // Update comment
// router.patch(
//   "/:commentId",
//   validate(updateCommentParamsSchema, "params"),
//   updateComment
// );

// // delete comment
// router.delete(
//   "/:commentId",
//   validate(deleteCommentParamsSchema, "params"),
//   deleteComment
// );

export default router;
