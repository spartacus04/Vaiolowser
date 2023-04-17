import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { fileCommand } from '../shared';

const archeokokoCommand : Command = {
	name: 'adios',
	aliases: ['archeokoko'],
	description: 'Invia una gif di archeokoko',

	async run(message : Message) { fileCommand(message, 'resources/gifs/archeokoko.gif') },
};

module.exports = archeokokoCommand;