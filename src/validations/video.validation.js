import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const createVideoSchema = Joi.object({
  videoFile: Joi.string().required(),
  thumbnail: Joi.string().optional(),
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  duration: Joi.string().optional(),
  isPublished: Joi.boolean().optional(),
  owner: objectId.required(),
});

export const updateVideoSchema = Joi.object({
  videoFile: Joi.string().optional(),
  thumbnail: Joi.string().optional(),
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(5).optional(),
  duration: Joi.string().optional(),
  isPublished: Joi.boolean().optional(),
}).min(1); // at least one field required

export const videoIdParamSchema = Joi.object({
  videoId: objectId.required(),
});

export const getAllVideosQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(20).default(10),
  query: Joi.string().min(1).optional(),
  sortBy: Joi.string()
    .valid("createdAt", "views", "title")
    .default("createdAt"),
  sortType: Joi.string().valid("asc", "desc").default("desc"),
});
