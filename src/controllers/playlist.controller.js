import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// validate owner
const validatePlaylistOwner = async (playlistId, userId) => {
  // 1. Find playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // 2. Ownership check
  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  return playlist;
};

// create playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const playlist = await Playlist.create({
    name,
    description: description ?? "",
    owner: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!playlist)
    throw new ApiError(401, "Something went wrong while creating playlist");

  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

// get user playlist
const getUserPlaylists = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const matchStage = {
    owner: new mongoose.Types.ObjectId(req.user._id),
  };

  if (query) {
    matchStage.name = { $regex: query, $options: "i" };
  }

  const aggregate = Playlist.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
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

  // const playlist = await Playlist.find({
  //   owner: new mongoose.Types.ObjectId(req.user._id),
  // });

  const playlist = await Playlist.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist featched successfully"));
});

// get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  console.log(playlistId);

  const playlist = await Playlist.findById(playlistId);

  if (playlist.length === 0)
    throw new ApiError(401, "Opps! There is no playlist");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetahced successfully"));
});

// Add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await validatePlaylistOwner(playlistId, req.user._id);

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already exists in playlist");
  }

  playlist.videos.push(videoId);

  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "video added to playlist successfully!")
    );
});

// remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await validatePlaylistOwner(playlistId, req.user._id);

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not found");
  }

  playlist.videos.pull(videoId);
  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "video removed from playlist successfully!"
      )
    );
});

// delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await validatePlaylistOwner(playlistId, req.user._id);

  await playlist.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

// update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const playlist = await validatePlaylistOwner(playlistId, req.user._id);

  const updateFields = {};

  if (name) updateFields.name = name;
  if (description) updateFields.description = description;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No valid fields provided to update");
  }

  playlist.set(updateFields);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
