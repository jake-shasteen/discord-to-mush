# discord-to-mush

Connects a Discord bot to a MUSH, allowing for cross-medium communication.

You could enhance this where it could let people see sheets or bboards or whatever on discord too if that's your preference.

Instructions assume recent PennMUSH

# MUSH set up
- Create a character for your bot
- It will need to be on any @channels you want it to mirror to discord
- You will need to set channel format on the bot character so that it strips any fancy formatting or comtitles:
- Set the character KEEPALIVE
- Set chatformat on character to: `%[%1%] [switch(%0,",%3 %6%, "%2",;,%3%2,:,%3%b%2,|,%2,@,%2)]`
- I also created a 'helper' object that sits in the master room and has the following properties so that the channel indicated by `bot_channel_id` records connects and disconnects:
```
ACONNECT [#901$]: @pemit *botcharacter=-%N %(%#%)- has connected.
ADISCONNECT [#901$]: @pemit *botcharacter=-%N %(%#%)- has disconnected.
```

# Discord set up
- Create a bot in discord using the app process. What permissions? Idk whatever you are comfortable with. I don't remember what I set mine to.
- Invite that bot to your discord server
- Set the `discord_token` to the token for that app
- Set up a private channel to echo everything the bot sees
- Set the id of channel to `bot_channel_id` 

# Environment variables

MUSH_PORT
- The port the MUSH is running on

MUSH_HOST
- The address of the MUSH

BOT_CHANNEL_ID
- The Discord channel ID you want to publish MUSH stuff on

MUSH_CHARACTER_NAME
- Login name on the MUSH for the bot

MUSH_CHARACTER_PASSWORD
- Login password on the MUSH for the bot

DISCORD_TOKEN
- Discord bot token

CHANNEL_PREFIX
- Specify a prefix for mirrored channels in discord. Default is bot-. The bot will attempt to mirror any channels it is on on the MUSH.
