import { Command } from '../../config';
import { Message } from 'discord.js';

const putteganaCommand : Command = {
	name: 'puttegana',
	description: 'Invia una puttegana',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/puttegana.jpeg'] });
	},
};

module.exports = putteganaCommand;