import { Command, TENOR_KEY } from '../../config';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import { logger } from '../../logger';

const lyonCommand : Command = {
	name: 'lyon',
	aliases: ['lyonwgf', 'lyon-wgf'],
	description: 'Invia una gif di lyon',

	async run(message : Message) {
		await message.channel.sendTyping();
		try {
			const res = await fetch(`https://api.tenor.com/v1/random?key=${TENOR_KEY}&q=saitama&limit=1`);
			const data = await res.json();
			logger.verbose(data);
			await message.channel.send(data.results[0].url);
		}
		catch (err) {
			message.channel.send('Non ho trovato una gif <:tasbien:712705754678951987>');
			logger.error(err);
		}

	},
};

module.exports = lyonCommand;