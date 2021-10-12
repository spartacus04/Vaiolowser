import { Command } from '../../config';
import { Message } from 'discord.js';

const hentaiCommand : Command = {
	name: 'hentai',
	aliases: ['dio'],
	description: 'Invia un hentai',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/dio.jpeg'] });
	},
};

module.exports = hentaiCommand;