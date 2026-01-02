import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // 1. Check if video exists
  // 2. Check if already liked by this user
  // 3. If not liked → like
  // 4. If already liked → unlike

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (!existingLike) {
    await Like.create({
      video: videoId,
      owner: video.owner,
      likedBy: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"));
  }

  await Like.findByIdAndDelete(existingLike._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: false }, "Disliked successfully"));
});

// toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "comment not found");

  const existingCommnet = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!existingCommnet) {
    await Like.create({
      comment: commentId,
      owner: comment.owner,
      likedBy: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"));
  }

  await Like.findByIdAndDelete(existingCommnet._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: false }, "Disliked successfully"));
});

// toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new ApiError(404, "tweet not found");

  const existingTweet = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (!existingTweet) {
    await Like.create({
      tweet: tweetId,
      owner: tweet.owner,
      likedBy: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"));
  }

  await Like.findByIdAndDelete(existingTweet._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: false }, "Disliked successfully"));
});

// get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const matchStage = {
    likedBy: new mongoose.Types.ObjectId(req.user._id),
  };

  const aggregate = Like.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $unwind: "$videos",
    },
    {
      $sort: {
        createdAt: -1, // latest liked first
      },
    },
    {
      $project: {
        _id: 0,
        videoId: "$videos._id",
        title: "$videos.title",
        thumbnail: "$videos.thumbnail",
        duration: "$videos.duration",
        views: "$videos.views",
      },
    },
  ]);
  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const likes = await Like.aggregatePaginate(aggregate, options);
  //   const likes = await Like.find({
  //     likedBy: req.user._id,
  //   }).populate("video");

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "liked videos featched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
