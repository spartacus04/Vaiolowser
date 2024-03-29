import fs from 'node:fs';
import { Message, TextChannel } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const jojoCommand: Command = {
	name: 'jojo',
	aliases: ['jojo-gif', 'jojo-gifs'],
	description: 'Invia una gif di Jojo',

	async run(message: Message) {
		await (<TextChannel>message.channel).sendTyping();

		try {
			const linkArray = fs.readFileSync('resources/gifs/jojolinks.txt', 'utf8').split('\n');
			const link = linkArray[Math.floor(Math.random() * linkArray.length)];

			logger.verbose(link);

			await (<TextChannel>message.channel).send(link);
		}
		catch (err) {
			(<TextChannel>message.channel).send('Non ho trovato una gif <:tasbien:712705754678951987>');
			logger.error(err);
		}
	},
};

module.exports = jojoCommand;
