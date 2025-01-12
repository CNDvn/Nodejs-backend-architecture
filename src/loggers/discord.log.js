"use strict";

const { discord } = require("../configs/config.mongodb");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  ],
});

const token = "";
console.log(token);
client.login(token);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "hello") {
    message.reply("hello, How can i assits you?");
  }
});
