import { Command } from '@commandHandler';
import { Message } from 'discord.js';

const pipoCommand : Command = {
	name: 'pipo',
	description: 'Invia un pipo',
	args: [
		{
			key: 'lenght',
			label: 'lunghezza del pipo',
			prompt: 'Inserisci la lunghezza del pipo',
			type: 'integer',
		},
	],

	async run(message : Message, { lenght } : { lenght : number }) {
		return message.channel.send(`8${'='.repeat(lenght)}D`);
	},
};

module.exports = pipoCommand;