#!/bin/sh
# Rename to start.sh
# I like to use pm2 to manage the bot so that it will restart when it crashes. It does crash from time to time.
# Upon restart it will automatically reconnect to the mush.
# BOT_CHANNEL_ID: You can get the channel id of a given channel by using the web version of discord and looking at the URL.
# It will be last thing in the path.
# This should be a channel the bot sends EVERYTHING it sees to
# Channels on your discord prepended with bot- will mirror in-game pennmush channels the bot is on
BOT_CHANNEL_ID=123412341234123412 DISCORD_TOKEN=discordapptoken MUSH_PORT=1111 MUSH_HOST=your.host.com MUSH_CHARACTER_NAME=character MUSH_CHARACTER_PASSWORD=password node index.js

