import { Command } from '../../config';
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

	run(message : Message, { text } : { text : string }) {
		if(text.toLowerCase() == 'vaiolowser bimbo fortnite') {
			return message.channel.send('*abortoad gay spagnolo*');
		}
		if(text.toLowerCase() == 'sessoforte') {
			return message.channel.send('*con Jack*');
		}
		if(text.toLowerCase() == 'esteban gay') {
			return message.channel.send('*ebbene si ragazzo*');
		}
		return message.channel.send(text);
	},
};

module.exports = sayCommand;