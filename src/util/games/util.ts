import { CollectorFilter, Message, MessageComponentInteraction, EmbedBuilder, TextChannel, Colors } from 'discord.js';
import { createButtonsRow } from '.';
import { NODE_ENV } from '../../config';

export const isGameChannel = (channelId : string) : boolean => NODE_ENV == 'production' ? channelId == '830519380931510282' : true;

export const RandomChance = (percent : number) : boolean => Math.random() * 100 < percent;

export interface multiplayerGameConfig {
    gameName: string,
    leader: string,
	leaderName : string,
    minPlayers : number,
    maxPlayers : number,
	debug: boolean,
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
			.setColor(Colors.Red)
			.setFooter({ text: `1/${config.maxPlayers}${config.minPlayers < config.maxPlayers ? `, minimo ${config.minPlayers}` : ''}` });

		const actionRow = createButtonsRow(['✅', '❌', '♿']);

		const message = await channel.send({ embeds: [embed], components: [actionRow] });

		const filter : CollectorFilter<[MessageComponentInteraction]> = (i : MessageComponentInteraction) : boolean => {
			if(i.customId == '0') {
				if(!players.includes(i.user.id) || config.debug) return true;
			}
			else if(i.customId == '1') {
				if(players.includes(i.user.id)) return true;
			}
			else if(i.customId == '2') {
				if(players[0] == i.user.id) return true;
			}
			return false;
		};

		const updateEmbed = async () => {
			let formattedUsers = '';
			playerNames.forEach((str) => {
				formattedUsers += str;
				if(str == playerNames[0]) {
					formattedUsers += '👑';
				}
				formattedUsers += '\n';
			});

			const newEmbed = new EmbedBuilder()
				.setTitle(`Unisciti a una partita di ${config.gameName}`)
				.addFields({ name: 'Giocatori', value: formattedUsers })
				.setColor(Colors.Red)
				.setFooter({ text: `${playerNames.length}/${config.maxPlayers}${config.minPlayers < config.maxPlayers ? `, minimo ${config.minPlayers}` : ''}` });
			await message.edit({ embeds : [newEmbed] });
		};

		const collector = await message.createMessageComponentCollector({ filter, time: 15000 });

		collector.on('collect', async i => {
			// Entrare nel gruppo
			if(i.customId == '0') {
				players.push(i.user.id);
				playerNames.push(i.user.username);
				if(players.length == config.maxPlayers) {
					return collector.stop();
				}
				collector.resetTimer();
				await updateEmbed();
			}

			// Uscire dal gruppo
			if(i.customId == '1') {
				if(players.indexOf(i.user.id) == 0) {
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
					collector.stop();
				}
			}
		});

		collector.on('end', async () => {
			if(players.length < config.minPlayers) {
				players.splice(0, players.length);
			}
			resolve({ players, message });
		});
	});
};