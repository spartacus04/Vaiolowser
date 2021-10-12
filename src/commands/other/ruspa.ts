import { Command } from '../../config';
import { Message } from 'discord.js';

const ruspaCommand : Command = {
	name: 'ruspa',
	description: 'Invia una ruspa',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/ruspa.jpeg'] });
	},
};

module.exports = ruspaCommand;