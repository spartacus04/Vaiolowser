import { MessageEmbed, MessageReaction, ReactionEmoji, User } from 'discord.js';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class RockpaperscissorsCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'rockpaperscissors',
      aliases: ['rockpaperscissors', 'rps'],
      memberName: 'rockpaperscissors',
      group: 'games',
      description: 'Sasso carta o forbice?'
    });
  }

  async run(message : CommandoMessage) {
    if(message.channel.id != "830519380931510282") return;

    var toReact = await message.say("Sasso carta o forbice?");

    toReact.react("🪨")
    .then(() => toReact.react("📰"))
    .then(() => toReact.react("✂️"));
    

    var res : number;
    do{
      res = Math.floor(Math.random() * 3);
    }while(res == 0)

    const emojiFilter = (reaction : MessageReaction, user : User) => {
      return ['🪨', '📰', '✂️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    return await toReact.awaitReactions(emojiFilter, { max: 1, time: 20000, errors: ['time'] }).then(function(reaction) {
      const first = reaction.first();
      const emojii = first.emoji.name;
      var embed = new MessageEmbed();

      var sum = res - RockpaperscissorsCommand.emojiToNum(emojii);
      
      if(sum == 0){
        embed.setTitle("Hai pareggiato");
        embed.setColor("#ffff00");
      }
      else if(sum == -1 || sum == 2){
        embed.setTitle("Hai Vinto!");
        embed.setColor("#00ff00");
      }
      else{
        embed.setTitle("Hai perso...");
        embed.setColor("#ff0000");
      }
      embed.setDescription(`ho scelto ${RockpaperscissorsCommand.numToEmoji(res)}.\n${RockpaperscissorsCommand.numToEmoji(res)} VS ${emojii}`)
      return message.say(embed);
    }).catch(collected => {
      message.delete();
      return toReact.delete();
    });
  }

  static numToEmoji(num : number) : string{
    if(num == 1) return "🪨";
    if(num == 2) return "📰";
    if(num == 3) return "✂️";
  }

  static emojiToNum(num : string) : number{
    if(num == "🪨") return 1;
    if(num == "📰") return 2;
    if(num == "✂️") return 3;
  }


}
