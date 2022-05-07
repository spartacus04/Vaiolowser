import { Command } from '../../config';
import { Message } from 'discord.js';
import { logger } from '../../logger';
import { blacklist } from '../../listeners/randomSound';

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

		const index = blacklist.indexOf(voiceChannel.id);
		if(index == -1) return;
		blacklist.splice(index, 1);
	},
};

module.exports = blacklistaddCommand;