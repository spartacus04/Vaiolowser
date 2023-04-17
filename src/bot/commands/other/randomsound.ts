import fs from 'node:fs';
import path from 'node:path';
import { Message } from 'discord.js';
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, StreamType } from '@discordjs/voice';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const randomSoundCommand : Command = {
	name: 'randomsound',
	aliases: ['random-sound'],
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
				adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
			});

			logger.info('Creating resources');
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
			resource.volume.setVolume(Math.floor(Math.random() * (5 - 1)) + 1);
			logger.verbose(resource);

			const player = createAudioPlayer();
			logger.verbose(player);

			player.play(resource);

			connection.subscribe(player);

			let flag = true;

			player.on(AudioPlayerStatus.Playing, () => {
				if(flag) {
					logger.info('Started resource playback');
					flag = false;
				}
			});

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