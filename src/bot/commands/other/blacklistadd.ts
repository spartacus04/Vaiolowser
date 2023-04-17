import { Message } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';
import { blacklist } from '@botlisteners/randomSound';

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

		const index = blacklist.indexOf(voiceChannel.id);
		if(index != -1) return message.reply('Canale già nella blacklist');
		blacklist.push(voiceChannel.id);

		return message.reply('Canale aggiunto alla blacklist');
	},
};

module.exports = blacklistaddCommand;