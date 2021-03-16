const { Command } = require('../../discord.js-commando/src');

module.exports = class WhoMadeMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'whomademe',
      aliases: ['bot-maker', 'bot-creator'],
      memberName: 'whomademe',
      group: 'other',
      description: "Risponde con il nome del creatore"
    });
  }

  run(message) {
    message.say(
      'Mio padre @sistone#9499 e mio zio @spartacus04#9422 mi hanno creato con :cinabro: Altre info a https://github.com/spartacus04/Vaiolowser'
    );
  }
};
