import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';
import fs from 'fs';
import path from 'path';
import internal from 'stream';
import { client } from '../config';
import { logger } from '../logger';


const playRandomSound = async () => {
	const mainGuild = await client.guilds.fetch('711540165012881438');
	await mainGuild.fetch();
	const channels = mainGuild.channels.cache.filter((channel) => channel.type === 'GUILD_VOICE').map((channel) => channel.id);

	for(let i = 0; i < channels.length; i++) {
		const channel = channels[i];

		const voiceChannel = mainGuild.channels.cache.get(channel) as VoiceChannel;

		if(!voiceChannel) continue;
		if(voiceChannel.members.size <= 0) continue;

		logger.info(`Playing sound in voiceChannel ${channel}`);

		try {
			await playSound(getRandomSound(), voiceChannel);
		}
		catch(err) {
			logger.error(`Could not play sound in voiceChannel ${channel}`);
		}
	}

	const time = getRandomOffset();
	logger.info(`Next random sound playback scheduled to ${time} ms from now`);

	setTimeout(playRandomSound, time);
};

export const playSound = async (stream : internal.Readable, channel : VoiceChannel) : Promise<void> => {
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
};

export const getRandomSound = () : internal.Readable => {
	const files = fs.readdirSync('resources/sounds');

	const filePath = files[Math.floor(Math.random() * files.length)];

	return fs.createReadStream(path.resolve(path.join('resources/sounds/', filePath)));
};

const getRandomOffset = () : number => {
	return Math.floor(Math.random() * (1000 * 60 * 30)) + (1000 * 60 * 15);
};

playRandomSound();