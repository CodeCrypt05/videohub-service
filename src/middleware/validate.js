import { ApiError } from "../utils/apiError.js";

export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // show all errors
      stripUnknown: true, // remove extra fields
    });

    if (error) {
      throw new ApiError(400, error.details.map((d) => d.message).join(", "));
    }

    if (property === "query") {
      // mutate query instead of replacing
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, value);
    } else {
      // replace request data with validated & sanitized data
      req[property] = value; // body / params
    }
    next();
  };
