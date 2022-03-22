import { Command } from '../../config';
import { Message, VoiceChannel } from 'discord.js';
import { getRandomSound, playSound } from '../../listeners/randomSound';

const randomSoundCommand : Command = {
	name: 'randomSound',
	description: 'Riproduce un suono casuale',

	async run(message : Message) {
		playSound(getRandomSound(), message.member.voice.channel as VoiceChannel);
	},
};

module.exports = randomSoundCommand;