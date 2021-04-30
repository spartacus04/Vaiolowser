import * as fs from 'fs';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class JojoCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'jojo',
      aliases: ['jojo-gif', 'jojo-gifs'],
      group: 'gifs',
      memberName: 'jojo',
      description: 'Replies with a random jojo gif!',
      throttling: {
        usages: 20,
        duration: 8
      }
    });
  }

  run(message : CommandoMessage) {
    const linkArray = fs
      .readFileSync('resources/gifs/jojolinks.txt', 'utf8')
      .split('\n');
    const link = linkArray[Math.floor(Math.random() * linkArray.length)];
    return message.say(link);
  }
};
