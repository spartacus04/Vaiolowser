import { Command } from '../../config';
import { Message, MessageEmbed } from 'discord.js';
import { isGameChannel, createButtonsRow, singleButtonInput, RandomChance } from '../../util';

const rpsCommand : Command = {
	name: 'rockpaperscissors',
	aliases: ['rps'],
	description: 'Gioca a sasso carta o forbice',

	async run(message : Message) {
		if(!isGameChannel(message.channel.id)) return;

		const computerMoves = ['✂️', '🪨', '📰', '✂️', '🪨'];

		const component = createButtonsRow(['🪨', '📰', '✂️'], [1, 2, 3]);

		const embed = new MessageEmbed().setTitle('Sasso, carta o forbice?').setDescription('Stai scegliendo la tua mossa');

		const reply = await message.reply({ embeds: [ embed ], components: [ component ] });

		const id = await singleButtonInput(reply, message.author.id);

		if(id == '-1') {
			const endEmbed = new MessageEmbed().setTitle('Sasso, carta o forbice?').setDescription(`${message.author.username} ha perso! Non ha risposto in tempo`);
			return await reply.edit({ embeds : [ endEmbed ] });
		}

		if(RandomChance(33)) {
			const endEmbed = new MessageEmbed().setTitle('Sasso, carta o forbice').setDescription(`${message.author.username} ha vinto!\n${computerMoves[+id]} - ${computerMoves[+id - 1]}`);
			return await reply.edit({ embeds: [ endEmbed ], components: [] });
		}
		else if(RandomChance(50)) {
			const endEmbed = new MessageEmbed().setTitle('Sasso, carta o forbice').setDescription(`${message.author.username} ha pareggiato!\n${computerMoves[+id]} - ${computerMoves[+id]}`);
			return await reply.edit({ embeds: [ endEmbed ], components: [] });
		}
		else{
			const endEmbed = new MessageEmbed().setTitle('Sasso, carta o forbice').setDescription(`${message.author.username} ha perso!\n${computerMoves[+id]} - ${computerMoves[+id + 1]}`);
			return await reply.edit({ embeds: [ endEmbed ], components: [] });
		}
	},
};

module.exports = rpsCommand;