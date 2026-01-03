import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get the channel stats like total video views, total subscribers, total videos, total likes etc.
const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const [totalSubscribers, totalVideos, totalLikes, totalViews] =
    await Promise.all([
      Subscription.countDocuments({ channel: channelId }),
      Video.countDocuments({ owner: channelId }),
      Like.countDocuments({ owner: channelId }),
      Video.aggregate([
        {
          $match: { owner: new mongoose.Types.ObjectId(channelId) },
        },
        {
          $group: { _id: null, totalViews: { $sum: "$views" } },
        },
      ]),
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribers,
        totalVideos,
        totalLikes,
        totalViews: totalViews[0]?.totalViews || 0,
      },
      "Channel stats fetched successfully"
    )
  );
});

// Get all the videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const videos = await Video.find({ owner: channelId });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
