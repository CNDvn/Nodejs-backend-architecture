"use strict";

const express = require("express");
const CommentController = require("../../controllers/comment.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

const router = express.Router();

// Authentication
router.use(authenticationV2);
////////////
router.post("", asyncHandler(CommentController.createComment));
router.delete("", asyncHandler(CommentController.deleteComment));
router.get("", asyncHandler(CommentController.getCommentsByParentId));

module.exports = router;
