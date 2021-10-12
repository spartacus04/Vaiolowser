import { Command } from '../../config';
import { Message } from 'discord.js';

const bigchungusCommand : Command = {
	name: 'bigchungus',
	aliases: ['big-chungus'],
	description: 'Invia un big chungus',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/gifs/bigchungus.gif'] });
	},
};

module.exports = bigchungusCommand;