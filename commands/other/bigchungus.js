const { Command } = require('discord.js-commando-it');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bigchungus',
      aliases: ['bigchungus'],
      memberName: 'bigchungus',
      group: 'other',
      description: 'Invia un big chungus'
    });
  }

  run(message) {
    message.channel.send({
        files: [{
            attachment: "https://tenor.com/brMsh.gif",
            name: 'brMsh.gif'
        }]
    })
  }
};
