const { Command } = require('../../discord.js-commando/src');

module.exports = class SayCommand extends Command {
  constructor(client) {
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

  run(message, { text }) {
    let bababui = text;
    if(text.toLowerCase() == "vaiolowser bimbo fortnite"){
      bababui = "abortoad gay spagnolo";
    }
    else if(text.toLowerCase() == "sessoforte"){
      bababui = "con jack";
    }
    else if(text.toLowerCase() == "esteban gay"){
      bababui = "SI";
    }
    if(text.toLowerCase().startsWith("/tts ")){
      bababui = text.replace("/tts ", "");
      return message.channel.send(bababui.replace("\n", " "), { tts: true });
    }
    else{
      return message.say(bababui);
    }
  }
};
