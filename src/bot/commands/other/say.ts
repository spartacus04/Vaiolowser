import { Command } from '@commandHandler';
import { Message } from 'discord.js';

const sayCommand : Command = {
	name: 'say',
	description: 'Ripeto cio che scrivi',
	args: [
		{
			key: 'text',
			label: 'testo da ripetere',
			prompt: 'Cosa vuoi farmi ripetere?',
			type: 'string',
		},
	],

	async run(message : Message, { text } : { text : string }) {
		switch(text.toLowerCase()) {
		case 'vaiolowser bimbo fortnite':
			message.channel.send('*abortoad gay spagnolo*');
			break;
		case 'sessoforte':
			message.channel.send('*con Jack*');
			break;
		case 'esteban gay':
			message.channel.send('*ebbene si ragazzo*');
			break;
		default:
			message.channel.send(text);
		}
	},
};

module.exports = sayCommand;