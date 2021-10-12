import { client } from '../config';
import { logger } from '../logger';

client.once('ready', () => {
	logger.info('Ready!');
	client.user.setActivity('le tue urla', {
		type: 'LISTENING',
		url: 'https://youtu.be/dQw4w9WgXcQ',
	});
});
