import { Message } from 'discord.js';
import { handleCommand } from '../commandHandler';
import { client, Listener, PREFIX } from '../config';

const messageCreateHandler = async (message: Message) => {
	client.on('messageCreate', (message : Message) => {
		if(message.content.toLowerCase().startsWith('vaiolowser rincoglionito')) {
			return void message.channel.send('no tu');
		}

		if(message.content.toLowerCase().startsWith(PREFIX) && !message.author.bot) return handleCommand(message);
	});
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