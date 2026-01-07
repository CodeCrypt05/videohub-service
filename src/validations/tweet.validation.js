import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const contentTweetSchema = Joi.object({
  content: Joi.string().min(1).required(),
});

export const tweetIdParamsSchema = Joi.object({
  tweetId: objectId.required(),
});
