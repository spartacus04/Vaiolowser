const { Command } = require('../../discord.js-commando/src');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class MotivationCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'proverbio',
      aliases: ['proverbio'],
      group: 'other',
      memberName: 'proverbio',
      description: 'dice un proverbio italiano'
    });
  }
  run(message) {

    const jsonQuotes = fs.readFileSync(
      'resources/proverbiItaliani.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];

    const quoteEmbed = new MessageEmbed()
      .setDescription(randomQuote.text)
      .setColor('#ff003c');
    return message.channel.send(quoteEmbed);
  }
};
