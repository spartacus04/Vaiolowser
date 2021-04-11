const { Command } = require('discord.js-commando-it');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'adios',
      aliases: ['adios;archeokoko'],
      memberName: 'adios',
      group: 'other',
      description: 'Invia un archeokoko che ti saluta'
    });
  }

  run(message) {
    message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/gifs/archokoko.gif",
            name: 'archokoko.gif'
        }]
    })
  }
};
