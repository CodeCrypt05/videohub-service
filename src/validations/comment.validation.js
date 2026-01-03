import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const getVideoCommentsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(20).default(10),
});

export const getVideoCommentsParamsSchema = Joi.object({
  videoId: objectId.required(),
});

export const addCommentParamsSchema = Joi.object({
  videoId: objectId.required(),
});

export const updateCommentParamsSchema = Joi.object({
  commentId: objectId.required(),
});

export const deleteCommentParamsSchema = Joi.object({
  commentId: objectId.required(),
});
