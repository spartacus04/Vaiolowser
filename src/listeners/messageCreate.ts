import { Message } from 'discord.js';
import { handleCommand } from '../commandHandler';
import { client, eMessage, PREFIX } from '../config';

client.on('messageCreate', (message : Message) => {
	if(message.content.toLowerCase().startsWith('vaiolowser rincoglionito')) {
		return void message.channel.send('no tu');
	}

	if(message.content.toLowerCase().startsWith(PREFIX) && !message.author.bot) return handleCommand(message as eMessage);
});