import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const getChannelStatsParamsSchema = Joi.object({
  channelId: objectId.required(),
});

export const getChannelVideosParamsSchema = Joi.object({
  channelId: objectId.required(),
});
