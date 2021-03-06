import fetch from 'node-fetch';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import { MessageEmbed } from 'discord.js';

module.exports = class InsultCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'insult',
      group: 'other',
      memberName: 'insult',
      description: 'Crea un isulto',
      throttling: {
        usages: 1,
        duration: 6
      }
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    return fetch('https://evilinsult.com/generate_insult.php?lang=de&type=json')
      .then(res => res.json())
      .then(json => {
        const embed = new MessageEmbed()
          .setColor('#E41032')
          .setTitle('Insulto')
          .setDescription(json.insult)
          .setURL('https://evilinsult.com');
        message.say(embed);
      })
      .catch(err => {
        message.say('Bruh non va :sob:');
        console.error(err);
      });
  }
};
