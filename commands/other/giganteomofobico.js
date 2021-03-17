const { Command } = require('../../discord.js-commando/src');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'giganteomofobico',
      aliases: ['giganteomofobico', 'omofobico'],
      memberName: 'giganteomofobico',
      group: 'other',
      description: 'Invia un gigante omofobico'
    });
  }

  run(message) {
    message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resouces/images/gigante.jpg",
            name: 'gigante.jpeg'
        }]
    })
  }
};
