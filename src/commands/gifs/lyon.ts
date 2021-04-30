import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import fetch from 'node-fetch';
const tenorAPI = process.env.tenorAPI;

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'lyon',
      aliases: ['lyon', 'lyonwgf'],
      memberName: 'lyon',
      group: 'other',
      description: 'Invia una gif di lyon wgf'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=lyonwgf&limit=1`)
      .then(res => res.json())
      .then(json => {return message.say(json.results[0].url)})
      .catch(err => {
        console.error(err);
        return message.say('Non ho trovato una gif <:tasbien:712705754678951987>');
      });
  }
};
