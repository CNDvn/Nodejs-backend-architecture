"use strict";
const { Client, GatewayIntentBits } = require("discord.js");
const { json } = require("express");
const { DEV_DISCORD_APP_TOKEN, DEV_DISCORD_SERVER_ID } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        [
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      ],
    });

    this.channelId = DEV_DISCORD_SERVER_ID;

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.login();
  }

  login() {
    this.client
      .login(DEV_DISCORD_APP_TOKEN)
      .then((v) => console.log("login discord success", v))
      .catch((err) => console.error("login discord fail", err));
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error("channel not found", this.channelId);
      return;
    }
    channel
      .send(message)
      .catch((err) => console.error("send message fail", err));
  }

  sendToFormatCode({
    title = "Code Example",
    code,
    message = "This is some additional information about the code",
  }) {
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), //convert hexadecimal to integer
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }
}

// const loggerService = new LoggerService();

module.exports = new LoggerService(); //loggerService;
