import { Command } from '../../config';
import { Message } from 'discord.js';

const pipoCommand : Command = {
	name: 'pipo',
	description: 'Invia un gigante omofobico',
	args: [
		{
			key: 'lenght',
			label: 'lunghezza del pipo',
			prompt: 'Inserisci la lunghezza del pipo',
			type: 'integer',
		},
	],

	async run(message : Message, { lenght } : { lenght : number }) {
		let p = '';
		for (let i = 0; i < lenght; i++) {
			p += '=';
		}
		return message.channel.send('8' + p + 'D');
	},
};

module.exports = pipoCommand;