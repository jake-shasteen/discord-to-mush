"use strict";
const net = require("net");
const { TelnetSocket } = require("telnet-stream");
const discord = require("discord.js");

const socket = net.createConnection(
  process.env.MUSH_PORT,
  process.env.MUSH_HOST
);

const tSocket = new TelnetSocket(socket);

tSocket.on("close", () => process.exit());

tSocket.on("data", buffer => {
  process.stdout.write(buffer.toString("utf-8"));
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
