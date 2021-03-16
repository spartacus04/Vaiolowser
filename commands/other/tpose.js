// const fetch = require("node-fetch");
// const { tenorAPI } = require("../config.json");
const fs = require('fs');
const { Command } = require('../../discord.js-commando/src');

module.exports = class JojoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tpose',
      aliases: ['tpose'],
      group: 'gifs',
      memberName: 'tpose',
      description: 'manda un personaggio del regno dei funghi in tpose',
      throttling: {
        usages: 20,
        duration: 8
      }
    });
  }

  run(message) {
    try {
      const linkArray = fs
        .readFileSync('resources/quotes/tpose.txt', 'utf8')
        .split('\n');
      const link = linkArray[Math.floor(Math.random() * linkArray.length)];
      return message.say(link);
    } catch (e) {
      return console.error(e);
    }
  }
};
