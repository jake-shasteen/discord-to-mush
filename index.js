"use strict";
const net = require("net");
const { TelnetSocket } = require("telnet-stream");
const chalk = require("chalk");
const Discord = require("discord.js");
const client = new Discord.Client();

const chunk = (string, chunkSize = 1000) => {
  let index = 0;
  const chunks = [];
  while (index < string.length) {
    chunks.push(string.substring(index, index + chunkSize));
    index += chunkSize;
  }
  return chunks;
};

client.login(process.env.DISCORD_TOKEN);

const socket = net.createConnection(
  process.env.MUSH_PORT,
  process.env.MUSH_HOST
);

const tSocket = new TelnetSocket(socket);

tSocket.on("close", () => process.exit());

client.once("ready", () => {
  client.channels.get(process.env.BOT_CHANNEL_ID).send("Starting up.");
  tSocket.on("data", buffer => {
    const outString = buffer.toString("utf-8");
    const channelPattern = /^\[(.+)\] (.+)$/gi;
    const chunks = outString.length > 2000 ? chunk(outString) : [outString];

    chunks.forEach(chunk => {
      client.channels
        .get(process.env.BOT_CHANNEL_ID)
        .send(chunk)
        .catch(e => console.log(e));
    });
    const channelMatch = channelPattern.exec(outString);
    try {
      channelMatch &&
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

    process.stdout.write(outString);
  });
});

process.stdin.on("data", buffer => tSocket.write(buffer.toString("utf-8")));

const connectString = Buffer.from(
  `connect ${process.env.MUSH_CHARACTER_NAME} ${
    process.env.MUSH_CHARACTER_PASSWORD
  }`,
  "utf-8"
);

tSocket.write(connectString);
tSocket.write("\n");

function exitHandler(options, exitCode) {
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) console.log(exitCode);
  client.channels.get(process.env.BOT_CHANNEL_ID).send("Shutting down.");
  if (options.exit) process.exit();
}

process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
