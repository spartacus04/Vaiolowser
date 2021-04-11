const { Command } = require('discord.js-commando-it');
const fetch = require('node-fetch');
const tenorAPI = process.env.tenorAPI;

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyon',
      aliases: ['lyon', 'lyonwgf'],
      memberName: 'lyon',
      group: 'other',
      description: 'Invia una gif di lyon wgf'
    });
  }

  run(message) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=lyonwgf&limit=1`)
      .then(res => res.json())
      .then(json => message.say(json.results[0].url))
      .catch(err => {
        message.say('Non ho trovato una gif <:tasbien:712705754678951987>');
        console.error(err);
        return;
      });
  }
};
