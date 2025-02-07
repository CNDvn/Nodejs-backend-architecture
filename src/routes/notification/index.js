"use strict";

const express = require("express");
const NotificationController = require("../../controllers/notificaiton.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// Here not login

const router = express.Router();

// Authentication
router.use(authenticationV2);
////////////
router.get("", asyncHandler(NotificationController.listNotiByUser));

module.exports = router;
