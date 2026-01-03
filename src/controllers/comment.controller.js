import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const validateOwner = async (commentId, userId) => {
  // 1. Find comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 2. Ownership check
  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  return comment;
};

// get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(401, "Video not found");

  // with aggregation and pagination
  // const aggregate = Comment.aggregate([
  //   {
  //     $match: {
  //       video: new mongoose.Types.ObjectId(videoId),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "owner",
  //       foreignField: "_id",
  //       as: "users",
  //     },
  //   },
  //   {
  //     $unwind: "$users",
  //   },
  //   {
  //     $sort: {
  //       createdAt: -1,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       content: 1,
  //       createdAt: 1,
  //       owner: {
  //         _id: "$users._id",
  //         userName: "$users.userName",
  //         avatar: "$users.avatar",
  //       },
  //     },
  //   },
  // ]);

  // const options = {
  //   page: Number(page),
  //   limit: Number(limit),
  // };

  // const comments = await Comment.aggregatePaginate(aggregate, options);

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, comments, "Comments fetched successfully"));

  // without aggregation and without pagination
  const skip = (Number(page) - 1) * Number(limit);
  // run queries in parallel (faster)
  const [comments, totalDocs] = await Promise.all([
    Comment.find({ video: videoId })
      .populate("owner", "userName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Comment.countDocuments({ video: videoId }),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        docs: comments,
        totalDocs,
        limit,
        page,
        totalPages,
      },
      "Comments fetched successfully"
    )
  );
});

// add comment
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  console.log("Enterd in comment");

  console.log("Here is video id: ", videoId);
  console.log("Conten: ", content);

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(401, "Video not found");

  const comment = await Comment.create({
    content,
    video: new mongoose.Types.ObjectId(videoId),
    owner: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// update comment
const updateComment = asyncHandler(async (req, res) => {
  // 1. check owner of that comment
  // 2. If true he can update the comment

  const { commentId } = req.params;
  const { content } = req.body;
  const updateFields = {};

  if (content) updateFields.content = content;

  const comment = await validateOwner(commentId, req.user._id);

  comment.set(updateFields);
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await validateOwner(commentId, req.user._id);

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
export { getVideoComments, addComment, updateComment, deleteComment };
