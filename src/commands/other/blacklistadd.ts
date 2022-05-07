import { Command } from '../../config';
import { Message } from 'discord.js';
import { logger } from '../../logger';
import { addToBlacklist } from '../../listeners/randomSound';

const blacklistaddCommand : Command = {
	name: 'addblacklist',
	adminOnly: true,
	aliases: ['add-blacklist', 'bladd'],
	description: 'Aggiunge un canale alla blacklist',

	async run(message : Message) {
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			logger.warn('User isn\'t in a voice channel');
			return message.reply('Devi essere in un canale plebeo');
		}

		addToBlacklist(voiceChannel.id);
	},
};

module.exports = blacklistaddCommand;