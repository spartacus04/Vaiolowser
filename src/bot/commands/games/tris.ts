import { Message, EmbedBuilder, TextChannel, Colors } from 'discord.js';
import { Command, isGameChannel, multiplayerGameConfigurator, singleButtonInput, createButtonsRow } from '@commandHandler';

const trisCommand : Command = {
	name: 'tris',
	aliases: ['ttt'],
	description: 'Gioca a tris',

	async run(message : Message) {
		if(!isGameChannel(message.channel.id)) return;

		const { players, message : gameMessage } = await multiplayerGameConfigurator(message.channel as TextChannel,
			{
				gameName: 'tris',
				leader: message.author.id,
				leaderName: message.author.username,
				minPlayers: 2,
				maxPlayers: 2,
			});

		if(players.length == 0) {
			return;
		}

		const playerNames = players.map((player) => message.guild.members.cache.find((member) => member.id == player).displayName);

		const board = ['⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜'];
		let turn = 0;
		let isTie = false;

		await render(board, gameMessage, playerNames, turn % 2);

		const gameLoop = async () => {
			console.log(isWin(board, '❌'));
			console.log(isWin(board, '🟡'));
			if(isWin(board, turn % 2 == 0 ? '🟡' : '❌')) {
				return;
			}

			if(turn == 9) {
				isTie = true;
				return;
			}

			const input = +(await singleButtonInput(gameMessage, players[turn % 2]));

			if(input < 0) {
				turn = -1;
				return;
			}

			board[input] = turn % 2 == 0 ? '❌' : '🟡';

			await render(board, gameMessage, playerNames, (turn + 1) % 2);

			turn++;
			await gameLoop();
		};

		await gameLoop();

		let text = '';

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				text += board[i * 3 + j];
			}
			text += '\n';
		}

		const embed = new EmbedBuilder()
			.setTitle(`🎲 ${playerNames[0]} - ${playerNames[1]}`)
			.setColor(Colors.Green)
			.setDescription(text);

		if(isTie) {
			embed.setFooter({ text: `${playerNames[0]} e ${playerNames[1]} hanno pareggiato!` });
		}
		else if(turn == -1) {
			embed.setFooter({ text: `${playerNames[(turn + 2) % 2]} non ha risposto, vince ${playerNames[(turn + 1 % 2)]}` });
		}
		else{
			embed.setFooter({ text: `${playerNames[turn % 2 == 0 ? 1 : 0]} ha vinto!` });
		}

		await gameMessage.edit({ embeds : [embed], components: [] });
	},
};

const render = async (board : string[], gameMessage : Message, playerNames : string[], turn : number) : Promise<void> => {
	const actionRows = [
		createButtonsRow(['↖️', '⬆️', '↗️'], [], board.slice(0, 3).map((str) => str != '⬜')),
		createButtonsRow(['⬅️', '⏺️', '➡️'], [3, 4, 5], board.slice(3, 6).map((str) => str != '⬜')),
		createButtonsRow(['↙️', '⬇️', '↘️'], [6, 7, 8], board.slice(6, 9).map((str) => str != '⬜')),
	];

	let text = '';

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			text += board[i * 3 + j];
		}
		text += '\n';
	}

	const embed = new EmbedBuilder()
		.setTitle(`🎲 ${playerNames[0]} - ${playerNames[1]}`)
		.setDescription(text)
		.setColor(Colors.Orange)
		.setFooter({ text: `È il turno di ${playerNames[turn]}` });
	await gameMessage.edit({ embeds: [ embed ], components : actionRows });
};

const isWin = (board : string[], turn : string) : boolean => {
	// Controllo righe
	for (let i = 0; i < 3; i++) {
		const arr = board.slice(i * 3, (i + 1) * 3);
		if(arr.filter(e => e != turn).length == 0) {
			return true;
		}
	}

	// Controllo colonne
	for (let i = 0; i < 3; i++) {
		const arr = [board[0 + i], board[3 + i], board[6 + i]];
		if(arr.filter(e => e != turn).length == 0) {
			return true;
		}
	}

	// Controllo diagonali
	const d1 = [board[0], board[4], board[8]];
	const d2 = [board[2], board[4], board[6]];

	if(d1.filter(e => e != turn).length == 0) {
		return true;
	}

	if(d2.filter(e => e != turn).length == 0) {
		return true;
	}

	return false;
};


module.exports = trisCommand;