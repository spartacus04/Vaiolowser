import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class CoinflipCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'coinflip',
      aliases: ['coinflip'],
      memberName: 'coinflip',
      group: 'games',
      description: 'testa o croce?'
    });
  }

  run(message : CommandoMessage) {
    if(message.channel.id != "830519380931510282") return;
    
    return message.say(Math.random() > 0.5 ? "È uscita testa!" : "È uscita croce!");
  }
};
