const { browseMessage } = require("../controllers/messages.c");
const { authenticate } = require("../middlewares/authenticate");

const Route = require("express").Router();

Route.get("/:channelID", authenticate, browseMessage);

module.exports = Route;
