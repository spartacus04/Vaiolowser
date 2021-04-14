import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'ruspa',
      aliases: ['ruspa;escavatore'],
      memberName: 'ruspa',
      group: 'other',
      description: 'Invia una ruspa'
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/images/ruspa.jpeg",
            name: 'ruspa.jpeg'
        }]
    })
  }
};
