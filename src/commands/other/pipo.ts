import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class SayCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'pipo',
      aliases: ['pipo', 'pene'],
      memberName: 'pipo',
      group: 'other',
      description: 'pipo',
      args: [
        {
          key: 'lenght',
          prompt: 'Inserisci la lunghezza',
          type: 'integer'
        }
      ]
    });
  }

  run(message : CommandoMessage, { lenght } : { lenght : number }) {
    var p : string = "";
    for (let i = 0; i < lenght; i++) {
      p += "=";
    }
    return message.say("8" + p + "D");
  }
};
