import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '@botcommands/shared';

const giganteCommand : Command = {
	name: 'gigante',
	aliases: ['giganteomofobico', 'gigante-omofobico'],
	description: 'Invia un gigante omofobico',

	async run(message : Message) { fileCommand(message, 'resources/images/gigante.jpeg'); },
};

module.exports = giganteCommand;