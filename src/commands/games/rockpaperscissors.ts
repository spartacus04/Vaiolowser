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
    if(message.channel.id == "830519380931510282") return;

    await message.say("Sasso carta o forbice?");

    await message.react("🪨");
    await message.react("📰");
    await message.react("✂️");

    var res = Math.floor(Math.random() * 3);

    const emojiFilter = (reaction : MessageReaction, user : User) => {
      return ['🪨', '📰', '✂️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };



    return await message.awaitReactions(emojiFilter, { max: 1, time: 60000, errors: ['time'] }).then(function(reaction) {
      const first = reaction.first();
      const emojii = first.emoji.name;
      var embed = new MessageEmbed();

      var sum = RockpaperscissorsCommand.emojiToNum(emojii) + res;

      embed.setTitle(sum == 0 ? "Hai pareggiato" : ((sum == -1) || (sum == 2) ? "Hai vinto!" : "Hai perso..."));
      embed.setDescription(`${RockpaperscissorsCommand.numToEmoji(res)} - ${emojii}`)
      return message.say(embed);
    })
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
