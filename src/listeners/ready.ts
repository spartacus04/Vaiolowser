import { ActivityType } from 'discord.js';
import { client, Listener } from '../config';
import { logger } from '../logger';

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
