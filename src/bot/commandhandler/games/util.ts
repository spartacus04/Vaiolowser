import { CollectorFilter, Message, MessageComponentInteraction, EmbedBuilder, TextChannel, Colors } from 'discord.js';
import { isDevelopment } from '@config';
import { createButtonsRow } from '.';

export const isGameChannel = (channelId : string) : boolean => isDevelopment || channelId == '830519380931510282';

export const RandomChance = (percent : number) : boolean => Math.random() * 100 < percent;

export interface multiplayerGameConfig {
    gameName: string,
    leader: string,
	leaderName : string,
    minPlayers : number,
    maxPlayers : number
}

interface multiplayerGameResult {
	message : Message,
	players: string[]
}

export const multiplayerGameConfigurator = async (channel: TextChannel, config : multiplayerGameConfig) : Promise<multiplayerGameResult> => {
	return new Promise<multiplayerGameResult>(async (resolve) => {
		const players : string[] = [ config.leader ];
		const playerNames : string[] = [ config.leaderName ];

		const embed = new EmbedBuilder()
			.setTitle(`Unisciti a una partita di ${config.gameName}`)
			.addFields({ name: 'Giocatori', value: `${config.leaderName}👑` })
			.setColor(Colors.Orange)
			.setFooter({ text: `1/${config.maxPlayers}${config.minPlayers < config.maxPlayers ? `, minimo ${config.minPlayers}` : ''}` });

		const actionRow = createButtonsRow(['✅', '❌', '♿']);

		const message = await channel.send({ embeds: [embed], components: [actionRow] });

		const filter : CollectorFilter<[MessageComponentInteraction]> = (i : MessageComponentInteraction) : boolean => {
			switch(i.customId) {
			case '0':
				if(!players.includes(i.user.id) || isDevelopment) return true;
				break;
			case '1':
				if(players.includes(i.user.id)) return true;
				break;
			case '2':
				if(players[0] == i.user.id) return true;
				break;
			};

			return false;
		};

		const updateEmbed = async (status: 'starting'|'cancelled'|'started' = 'starting') => {
			const formattedUsers = playerNames.reduce((acc, cur, i) => {
				if(i == 0) return acc;
				return acc + cur + '\n';
			}, playerNames[0] + '👑\n');

			const newEmbed = new EmbedBuilder()
				.setTitle(`Unisciti a una partita di ${config.gameName}`)
				.addFields({ name: 'Giocatori', value: formattedUsers })
				.setFooter({ text: `${playerNames.length}/${config.maxPlayers}${config.minPlayers < config.maxPlayers ? `, minimo ${config.minPlayers}` : ''}` });

			switch(status) {
				case 'starting':
					newEmbed.setColor(Colors.Orange);
					break;
				case 'cancelled':
					newEmbed.setColor(Colors.Red);
					newEmbed.setFooter({ text: 'Partita annullata' });
					break;
				case 'started':
					newEmbed.setColor(Colors.Green);
					break;
			}

			await message.edit({ embeds : [newEmbed], components: status != 'starting' ? [] : [actionRow] });
		};

		const collector = await message.createMessageComponentCollector({ filter, time: 15000 });

		collector.on('collect', async i => {
			// Entrare nel gruppo
			if(i.customId == '0') {
				players.push(i.user.id);
				playerNames.push(i.user.username);

				if(players.length == config.maxPlayers) {
					i.deferUpdate();
					await updateEmbed('started');
					return collector.stop();
				}

				collector.resetTimer();
				await updateEmbed();
			}

			// Uscire dal gruppo
			if(i.customId == '1') {
				if(players.indexOf(i.user.id) == 0) {
					i.deferUpdate();
					await updateEmbed('cancelled');
					players.splice(0, players.length);
					return collector.stop();
				}

				players.splice(players.indexOf(i.user.id), 1);
				playerNames.splice(playerNames.indexOf(i.user.username), 1);

				collector.resetTimer();
				await updateEmbed();
			}

			// Avviare la partita
			if(i.customId == '2') {
				if(players.length >= config.minPlayers) {
					i.deferUpdate();
					await updateEmbed('started');
					collector.stop();
				}
				else {
					i.reply({ content: `Non hai abbastanza giocatori, minimo ${config.minPlayers}`, ephemeral: true });
				}
			}
		});

		collector.on('end', async () => {
			if(players.length < config.minPlayers) {
				await updateEmbed('cancelled');
				players.splice(0, players.length);
			}

			resolve({ players, message });
		});
	});
};