import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class SayCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'say',
      aliases: ['make-me-say', 'print'],
      memberName: 'say',
      group: 'other',
      description: 'Ripeto cio che dici',
      args: [
        {
          key: 'text',
          prompt: 'Cosa vuoi farmi ripetere?',
          type: 'string'
        }
      ]
    });
  }

  run(message : CommandoMessage, { text } : { text : string }) {
    let bababui = text;
    if(text.toLowerCase() == "vaiolowser bimbo fortnite"){
      bababui = "*abortoad gay spagnolo*";
    }
    else if(text.toLowerCase() == "sessoforte"){
      bababui = "*con jack*";
    }
    else if(text.toLowerCase() == "esteban gay"){
      bababui = "*Ebbene si ragazzo*";
    }
    return message.say(`*${bababui}*`);
  }
};
