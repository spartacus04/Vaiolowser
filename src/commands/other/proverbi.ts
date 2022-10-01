import { Command } from '../../config';
import { Message, EmbedBuilder } from 'discord.js';
import { logger } from '../../logger';
import fs from 'fs';

const proverbiCommand : Command = {
	name: 'proverbi',
	aliases: ['proverbiitaliani', 'proverbi-italiani'],
	description: 'Invia info riguardo al creatore',

	async run(message : Message) {
		const quotes = JSON.parse(fs.readFileSync('resources/quotes/proverbi.json', 'utf8')).quotes;

		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		logger.info(`sending quote: ${randomQuote.text}`);

		const quoteEmbed = new EmbedBuilder()
			.setTitle(randomQuote.text)
			.setColor('#ff003c');

		return message.channel.send({ embeds : [ quoteEmbed ] });
	},
};

module.exports = proverbiCommand;