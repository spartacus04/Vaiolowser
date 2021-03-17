const { Command } = require('../../discord.js-commando/src');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ruspa',
      aliases: ['ruspa;escavatore'],
      memberName: 'ruspa',
      group: 'other',
      description: 'Invia una ruspa'
    });
  }

  run(message) {
    message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/images/ruspa.jpeg",
            name: 'ruspa.jpeg'
        }]
    })
  }
};
