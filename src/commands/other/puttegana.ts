import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'puttegana',
      aliases: ['puttegana;topoputtana;topo'],
      memberName: 'puttegana',
      group: 'other',
      description: 'Invia una puttegana'
    });
  }

  run(message : CommandoMessage) {
    return message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/images/puttegana.jpeg",
            name: 'puttegana.jpeg'
        }]
    })
  }
};
