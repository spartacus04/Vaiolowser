import dotenv from 'dotenv';
dotenv.config();

import fs from 'node:fs';
import { DISCORD_TOKEN, client, Listener } from './config';
import path from 'node:path';
import { getGroups, loadGroup } from './util';
import { logger } from './logger';

client.commands = [];

(async () => {
	logger.info('Starting...');
	// Initialize Commands
	const groups = getGroups();

	await groups.forEach(async group => {
		await loadGroup(group);
	});

	logger.info('Fully loaded commands');

	// Initialize Listeners
	const Listeners = fs.readdirSync(path.join(__dirname, 'listeners'));
	const deferredListeners = new Map<string, Listener>();

	Listeners.forEach(async listenerFile => {
		logger.info(`Loading listener ${listenerFile}`);
		const listener : Listener = await import(`./listeners/${listenerFile}`);

		if(listener.deferred) {
			deferredListeners.set(listenerFile, listener);
		}
		else {
			listener.register();
		}
	});

	logger.info('Fully loaded listeners');

	client.login(DISCORD_TOKEN).then(() => {
		deferredListeners.forEach(async (listener, key) => {
			logger.info(`Loading deferred listener ${key}`);
			await listener.register();
		});

		logger.info('Fully loaded deferred listeners');
	});
})();