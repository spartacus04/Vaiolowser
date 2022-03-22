import { Command } from '../../config';
import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { logger } from '../../logger';
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } from '@discordjs/voice';

const randomSoundCommand : Command = {
	name: 'randomSound',
	description: 'Riproduce un suono casuale',

	async run(message : Message) {
		const files = fs.readdirSync('resources/sounds');
		const filePath = files[Math.floor(Math.random() * files.length)];

		const stream = fs.createReadStream(path.resolve(path.join('resources/sounds/', filePath)));

		// fetch author voice channel
		const channel = message.member?.voice?.channel;

		if(!channel) return message.channel.send('Devi essere in un canale vocale bruh');

		return await new Promise<void>(async (resolve, reject) => {
			logger.info('Joining voice channel');
			const connection = await joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			logger.info('Creating resources');
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
			logger.verbose(resource);

			const player = createAudioPlayer();
			logger.verbose(player);

			player.play(resource);

			connection.subscribe(player);

			player.on(AudioPlayerStatus.Playing, () => { logger.info('Started resource playback'); });

			player.on(AudioPlayerStatus.Idle, () => {
				logger.info('Stopped resource playback');
				connection.destroy();
				resolve();
			});

			player.on('error', (err) => {
				logger.info('Something went wrong');
				logger.error(err.stack);
				connection?.destroy();
				reject(err);
			});
		});
	},
};

module.exports = randomSoundCommand;