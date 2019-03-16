"use strict";
const net = require("net");
const { TelnetSocket } = require("telnet-stream");
const chalk = require("chalk");
const Discord = require("discord.js");

const chunk = require("./chunk");

// Initialize MUSH connection
const socket = net.createConnection(
  process.env.MUSH_PORT,
  process.env.MUSH_HOST
);

const tSocket = new TelnetSocket(socket);

// Initialize Discord connection
const client = new Discord.Client();

// Add listeners
tSocket.on("close", () => process.exit());

client.once("ready", () => {
  client.channels.get(process.env.BOT_CHANNEL_ID).send("Starting up.");
  tSocket.on("data", buffer => {
    const outString = buffer.toString("utf-8");

    // Send to bot's main channel
    const chunks = outString.length > 2000 ? chunk(outString) : [outString];
    chunks.forEach(chunkedString => {
      if (chunkedString !== "\n\r") {
        client.channels
          .get(process.env.BOT_CHANNEL_ID)
          .send(chunkedString)
          .catch(e => console.log(e, "\nchunkedString:", chunkedString));
      }
    });

    // If it's a message from a channel on the MUSH, try to send to corresponding discord channel
    const channelPattern = /^\[(.+)\] (.+)/gi;
    const channelMatch = channelPattern.exec(outString);
    try {
      channelMatch &&
        channelMatch[2] &&
        !channelMatch[2]
          .toLowerCase()
          .startsWith(process.env.MUSH_CHARACTER_NAME) &&
        !channelMatch[2].startsWith("From Discord") &&
        client.channels
          .find(
            channel =>
              channel.name ===
              `bot-${channelMatch[1]
                .split(" ")
                .join("-")
                .toLowerCase()}`
          )
          .send(channelMatch[0])
          .catch(e => console.log(e));
    } catch (e) {
      console.log(
        "failed to send to channel",
        channelMatch && `bot-${channelMatch[1].split(" ").join("-")}`,
        e
      );
    }

    // Also send output to terminal
    process.stdout.write(outString);
  });
});

// Listen to input into terminal window, act as a telnet client
process.stdin.on("data", buffer => tSocket.write(buffer.toString("utf-8")));

// Forward channel messages to MUSH
client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.name.substring(0, 4) === "bot-") {
    tSocket.write(
      Buffer.from(
        `@cemit/noisy ${message.channel.name.substring(4, 7)}=From Discord: ${
          message.member.displayName
        } says, "${message.content.replace(/\n/gi, "%r")}"`,
        "utf-8"
      )
    );
    tSocket.write("\n");
  }
});

// Connect to MUSH
const connectString = Buffer.from(
  `connect ${process.env.MUSH_CHARACTER_NAME} ${
    process.env.MUSH_CHARACTER_PASSWORD
  }`,
  "utf-8"
);

tSocket.write(connectString);
tSocket.write("\n");

// Connect to Discord
client.login(process.env.DISCORD_TOKEN);
