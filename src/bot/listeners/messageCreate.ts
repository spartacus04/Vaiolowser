import { Message } from 'discord.js';
import { PREFIX } from '@config';
import { Listener, client, handleCommand } from '@commandHandler';

const messageCreateHandler = (message : Message) => {
	if(message.content.toLowerCase().startsWith('vaiolowser rincoglionito')) {
		return void message.channel.send('no tu');
	}

	if(message.content.toLowerCase().startsWith(PREFIX) && !message.author.bot) return handleCommand(message);
};

const messageCreateListener : Listener = {
	deferred: false,

	register: () => {
		client.on('messageCreate', messageCreateHandler);
	},

	unregister: () => {
		client.off('messageCreate', messageCreateHandler);
	},
};

module.exports = messageCreateListener;