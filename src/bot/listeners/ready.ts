import { Listener, client } from '@commandHandler';
import { logger } from '@logger';
import { ActivityType } from 'discord.js';

const readyListener : Listener = {
	deferred: false,

	register: () => {
		client.once('ready', () => {
			logger.info('Ready!');
			client.user.setActivity('le tue urla', {
				type: ActivityType.Listening,
				url: 'https://youtu.be/dQw4w9WgXcQ',
			});
		});
	},
};

module.exports = readyListener;
