import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  videos: Joi.string().optional(),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  videos: Joi.string().optional(),
}).min(1);

export const playListIdParamSchema = Joi.object({
  playlistId: objectId.required(),
});

export const addAndRemoveVideoToPlaylistParamSchema = Joi.object({
  playlistId: objectId.required(),
  videoId: objectId.required(),
});

export const getPlayListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(20).default(10),
  query: Joi.string().min(1).optional(),
  sortBy: Joi.string()
    .valid("createdAt", "views", "title")
    .default("createdAt"),
  sortType: Joi.string().valid("asc", "desc").default("desc"),
});
