"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createComment,
  getCommentsByParentId,
  deleteComments,
} = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new comment",
      metadata: await createComment(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "get comments",
      metadata: await getCommentsByParentId(req.query),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "delete comments",
      metadata: await deleteComments(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
