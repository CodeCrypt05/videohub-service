import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const validateVideoOwner = async (videoId, userId) => {
  // 1️. Validate ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  // 2. Find video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 3. Ownership check
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  return video;
};

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // 1. Filter only published videos
  // 2. search by title query (optional)
  // 3. aggregate pipline
  // 4. return response videoUrl, title, username, fullname, avatar, views

  const matchStage = {
    isPublished: true,
  };

  if (query) {
    matchStage.title = { $regex: query, $options: "1" };
  }

  const aggregate = Video.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              userName: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$owner" },

    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
  ]);

  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const video = await Video.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Videos featched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoLocalPath = req.files?.video[0]?.path;
  let thumbnailLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  if (!videoLocalPath) throw new ApiError(400, "Video file is required");

  const videoPath = await uploadOnCloudinary(videoLocalPath);
  const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoPath)
    throw new ApiError(500, "Something went wrong while uploading video");

  const video = await Video.create({
    videoFile: videoPath?.url || "",
    title,
    description,
    thumbnail: thumbnailPath?.url || "",
    owner: req.user._id,
  });

  if (!video)
    throw new ApiError(500, "Something went wrong while uploading user");

  return res
    .status(201)
    .json(new ApiResponse(200, "Video Uploaded Successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO: get video by id

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              userName: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$owner" },
  ]);

  return res.status(201).json(new ApiResponse(200, video));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  // 1. check video id is valid
  // 2. find video
  // 3. Authorization (owner only)
  // 4. Update video details

  const { videoId } = req.params;
  const { title, description } = req.body;

  const video = await validateVideoOwner(videoId, req.user._id);

  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = title;

  if (req.files?.thumbnail?.length > 0) {
    const thumbnailLocalPath = req.files.thumbnail[0].path;
    const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath);
    updateFields.thumbnail = thumbnailPath;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No valid fields provided to update");
  }

  // await oldImageDeleteFromCloudinary(video.thumbnail);

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateFields,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateVideo, "video details updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  const video = await validateVideoOwner(videoId, req.user._id);

  if (video.thumbnail) {
    await deleteFromCloudinary(video.thumbnail);
  }

  if (video.videoFile) {
    await deleteFromCloudinary(video.videoFile);
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await validateVideoOwner(videoId, req.user._id);

  const updateVideoDetials = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: video.isPublished ? false : true,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        `Video published status changed to ${updateVideoDetials.isPublished}`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
