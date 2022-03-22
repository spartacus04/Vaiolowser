import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { DISCORD_TOKEN, client } from './config';
import path from 'path';
import { forEachParallel, getGroups, loadGroup } from './util';
import { logger } from './logger';

client.commands = [];

const defer = ['firebaseListen', 'randomSound'];

const init = async () => {
	logger.info('Starting...');
	// Initialize Commands
	const groups = getGroups();

	await groups.forEach(async group => {
		await loadGroup(group);
	});

	logger.info('Fully loaded commands');

	// Initialize Listeners
	const Listeners = fs.readdirSync(path.join(__dirname, 'listeners'));

	await forEachParallel(Listeners, async listenerFile => {
		if(!defer.includes(listenerFile.split('.')[0])) {
			logger.info(`Loading Listener ${listenerFile}`);
			await import(`./listeners/${listenerFile}`);
		}
	});

	logger.info('Fully loaded listeners');

	await client.login(DISCORD_TOKEN).then(() => {
		logger.info('Logged in');
	});

	await forEachParallel(defer, async listenerFile => {
		logger.info(`Loading Deferred Listener ${listenerFile}`);
		await import(`./listeners/${listenerFile}`);
	});
};

init();