import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'hentai',
      aliases: ['hentai;dio'],
      memberName: 'hentai',
      group: 'other',
      description: 'Invia una hentai'
    });
  }

  run(message : CommandoMessage) {
    return message.channel.send({
        files: [{
            attachment: "https://raw.githubusercontent.com/spartacus04/Vaiolowser/master/resources/images/Dio.jpeg",
            name: 'Dio.jpeg'
        }]
    })
  }
};
