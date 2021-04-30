import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'adios',
      aliases: ['adios;archeokoko'],
      memberName: 'adios',
      group: 'other',
      description: 'Invia un archeokoko che ti saluta'
    });
  }

  run(message : CommandoMessage) {
    return message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/gifs/archeokoko.gif",
            name: 'archokoko.gif'
        }]
    })
  }
};
