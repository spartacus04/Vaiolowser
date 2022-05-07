import { Command } from '../../config';
import { Message } from 'discord.js';
import { logger } from '../../logger';
import { removeFromBlacklist } from '../../listeners/randomSound';

const blacklistaddCommand : Command = {
	name: 'removeblacklist',
	adminOnly: true,
	aliases: ['remove-blacklist', 'blremove'],
	description: 'Aggiunge un canale alla blacklist',

	async run(message : Message) {
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			logger.warn('User isn\'t in a voice channel');
			return message.reply('Devi essere in un canale plebeo');
		}

		removeFromBlacklist(voiceChannel.id);
	},
};

module.exports = blacklistaddCommand;