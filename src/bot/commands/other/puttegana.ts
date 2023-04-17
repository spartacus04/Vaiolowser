import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '@botcommands/shared';

const putteganaCommand : Command = {
	name: 'puttegana',
	description: 'Invia una puttegana',

	async run(message : Message) { fileCommand(message, 'resources/images/puttegana.jpeg') },
};

module.exports = putteganaCommand;