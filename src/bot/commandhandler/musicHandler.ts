import internal, { PassThrough } from 'node:stream';
import ytdl from 'ytdl-core';
import YouTube from 'simple-youtube-api';
import { PlayerSubscription } from '@discordjs/voice';
import { Collection, VoiceChannel } from 'discord.js';
import { logger } from '@logger';
import { ACCOUNT_PROXY_SERVER_HOST } from '@config';

type videoPayload = {
	videoId: string;
	reason: string;
};

export interface videoObj {
	url: string;
	id: string;
	ageRestricted: boolean;
	title: string;
	rawDuration: YouTube.Video.DurationObject;
	duration: string;
	thumbnail: string;
	voiceChannel: VoiceChannel;
	memberDisplayName: string;
	memberAvatar: string;
}

export interface musicGuild {
	queue: videoObj[];
	isPlaying: boolean;
	nowPlaying: videoObj;
	songDispatcher: PlayerSubscription;
	volume: number;
}

export const music = new Collection<string, musicGuild>();

export const pushToQueue = (guildId: string, video: videoObj): void => {
	const guild = music.get(guildId);
	if (!guild) {
		logger.info('Creating guild musicHandler');
		music.set(guildId, {
			queue: [],
			isPlaying: false,
			nowPlaying: null,
			songDispatcher: null,
			volume: 1,
		});
	}
	music.get(guildId).queue.push(video);
};

export const downloadVideo = async (video: videoObj): Promise<internal.Readable> => {
	const audioUrl = await getAudioUrl(video);

	const stream = new PassThrough();

	try {
		((await fetch(audioUrl)).body as unknown as internal.Readable).pipe(stream);
	}
	catch (e) {
		if (video.ageRestricted) {
			return null;
		}

		ytdl(video.url, {
			filter: 'audioonly',
			quality: 'highestaudio',
			highWaterMark: 1 << 25,
		}).pipe(stream);
	}

	return stream;
};

const getAudioUrl = async (video: videoObj): Promise<string> => {
	const queryParams = new URLSearchParams(payloadAssembler(video)).toString();

	const proxyUrl = `${ACCOUNT_PROXY_SERVER_HOST}/getPlayer?${queryParams}`;

	const data = <any>await (await fetch(proxyUrl)).json();

	const audios: any[] = data.streamingData.adaptiveFormats.filter(
		(e: any) => e.mimeType.startsWith('audio') && e.mimeType.includes('opus'),
	);

	const audioUrl = audios[0].url;

	return audioUrl;
};

const payloadAssembler = (video: videoObj): any => {
	const payload: videoPayload = {
		videoId: video.id,
		reason: 'AGE_VERIFICATION_REQUIRED',
	};

	return payload;
};
