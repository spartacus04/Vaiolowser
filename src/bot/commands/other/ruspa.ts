import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '@botcommands/shared';

const ruspaCommand : Command = {
	name: 'ruspa',
	description: 'Invia una ruspa',

	async run(message : Message) { fileCommand(message, 'resources/images/ruspa.jpeg'); },
};

module.exports = ruspaCommand;