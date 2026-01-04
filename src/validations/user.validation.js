import Joi from "joi";
import { objectId } from "./custom.validators.js";

export const registerUserSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().min(3).required(),
  userName: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().min(3).required(),
  userName: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
});

export const changeCurrentPasswordSchema = Joi.object({
  curruntPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

export const updateCurrentUserProfileSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().min(3).required(),
});

export const getUserChannelProfileParamsSchema = Joi.object({
  username: Joi.string().min(3).required(),
});

// export const updateCurruntUserAvatarSchema = Joi.object({
//   fullName: Joi.string().min(3).required(),
//   email: Joi.string().min(3).required(),
// });
