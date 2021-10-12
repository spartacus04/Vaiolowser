import { Command } from '../../config';
import { Message } from 'discord.js';
import { isGameChannel, RandomChance } from '../../util';

const coinflipCommand : Command = {
	name: 'coinflip',
	aliases: ['cf'],
	description: 'Gioca a testa o croce',

	async run(message : Message) {
		if(!isGameChannel(message.channel.id)) return;

		return message.channel.send(RandomChance(50) ? 'È uscita testa!' : 'È uscita croce!');
	},
};

module.exports = coinflipCommand;