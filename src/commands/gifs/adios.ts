import { Command } from '../../config';
import { Message } from 'discord.js';

const archeokokoCommand : Command = {
	name: 'adios',
	aliases: ['archeokoko'],
	description: 'Invia una gif di archeokoko',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/gifs/archeokoko.gif'] });
	},
};

module.exports = archeokokoCommand;