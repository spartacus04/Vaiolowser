import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { gifCommand } from '../shared';

const lyonCommand : Command = {
	name: 'lyon',
	aliases: ['lyonwgf', 'lyon-wgf'],
	description: 'Invia una gif di lyon',

	async run(message : Message) { gifCommand(message, 'saitama'); },
};

module.exports = lyonCommand;