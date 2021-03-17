/* eslint-disable no-empty */
const { CommandoClient } = require('./discord.js-commando/src');
const { Structures } = require('discord.js');
const path = require('path');
const Cron = require("cron");
const fetch = require('node-fetch');

const client = new CommandoClient({
  commandPrefix: "v.",
  owner: "820979452892020786" // value comes from config.json
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['gifs', 'Gif'],
    ['other', 'Altro'],
    ['guild', 'Comandi del server']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
    prefix: false,
    commandState: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity(`un gioco piselloso`, {
    type: 'PLAYNG',
    url: 'https://youtu.be/pnHg892Xwpk'
  });
});

client.on('message', message => {

 {
    if(message.content.toLowerCase() == "vaiolower finocchio"){
      message.channel.send("No tu");
    }
  }
  

});

client.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    !newState.channelID &&
    newState.guild.musicData.songDispatcher &&
    newState.member.user.id == client.user.id
  ) {
    newState.guild.musicData.queue.length = 0;
    newState.guild.musicData.songDispatcher.end();
    return;
  }
  if (
    newState.member.user.bot &&
    newState.channelID &&
    newState.member.user.id == client.user.id &&
    !newState.selfDeaf
  ) {
    newState.setSelfDeaf(true);
  }
});

client.login(process.env.token);
