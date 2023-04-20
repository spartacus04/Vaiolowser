import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { redditCommand } from '@botcommands/shared';

const catCommand : Command = {
	name: 'cat',
	aliases: ['catpic', 'rock'],
	description: 'Risponde con un immagine di un sasso',

	async run(message : Message) { redditCommand(message, ['geologyporn']); },
};

module.exports = catCommand;