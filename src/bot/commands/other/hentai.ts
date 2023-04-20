import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '@botcommands/shared';

const hentaiCommand : Command = {
	name: 'hentai',
	aliases: ['dio'],
	description: 'Invia un hentai',

	async run(message : Message) { fileCommand(message, 'resources/images/dio.jpeg'); },
};

module.exports = hentaiCommand;