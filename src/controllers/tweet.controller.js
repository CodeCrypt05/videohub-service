import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// create new tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(400, "Content is required");

  const tweet = await Tweet.create({
    owner: req.user._id,
    content,
  });

  if (!tweet)
    throw new ApiError(400, "Something wen wrong while saving tweet.");

  return res
    .status(201)
    .json(new ApiResponse(200, tweet, "Tweet Saved successfully."));
});

// get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
  const tweet = await Tweet.find();
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweets fetached successfully"));
});

// update tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { id, content } = req.body;

  if (!id) throw new ApiError(400, "Invalid video id");
  if (!content) throw new ApiError(400, "Content is required");

  const updatedTweet = await Tweet.findByIdAndUpdate(
    id,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "tweet updated successfully"));
});

// delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
