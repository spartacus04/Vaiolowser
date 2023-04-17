import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '../shared';

const bigchungusCommand : Command = {
	name: 'bigchungus',
	aliases: ['big-chungus'],
	description: 'Invia un big chungus',

	async run(message : Message) { fileCommand(message, 'resources/gifs/bigchungus.gif') },
};

module.exports = bigchungusCommand;