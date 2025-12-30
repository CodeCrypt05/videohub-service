import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// validate id
const isValidId = async (id) => {
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid video id");
  return;
};

// create playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name && !description)
    throw new ApiError(401, "Name and description is mandatory");

  const playlist = await Playlist.create({
    name,
    description,
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
  const { userId } = req.params;
  isValidId(userId);

  const playlist = await Playlist.find({
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist featched successfully"));
});

export { createPlaylist, getUserPlaylists };
