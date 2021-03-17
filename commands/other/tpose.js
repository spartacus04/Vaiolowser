const fs = require('fs');
const { Command } = require('../../discord.js-commando/src');

module.exports = class JojoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tpose',
      aliases: ['tpose'],
      group: 'gifs',
      memberName: 'tpose',
      description: 'manda un personaggio del regno dei funghi in tpose',
      throttling: {
        usages: 20,
        duration: 8
      }
    });
  }

  run(message) {
    try {
      var files = fs.readdirSync('resources/images/tpose');
      const link = files[Math.floor(Math.random() * files.length)];
      return message.channel.send({
        files: [{
          attachment: `https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/images/tpose/${link}`,
          name: 'tpose.jpeg'
        }]}
      );
    } catch (e) {
      return console.error(e);
    }
  }
};
