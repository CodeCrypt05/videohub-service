import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const videoLikeParamSchema = Joi.object({
  videoId: objectId.required(),
});
export const commentLikeParamSchema = Joi.object({
  commentId: objectId.required(),
});
export const tweetLikeParamSchema = Joi.object({
  tweetId: objectId.required(),
});

export const getLikedVideosSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(20).default(10),
});
