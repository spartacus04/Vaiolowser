import { Command } from '../../config';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { createButtonsRow, isGameChannel, multiplayerGameConfigurator, singleButtonInput } from '../../util';

const connect4Command : Command = {
	name: 'connect4',
	aliases: ['c4'],
	description: 'Gioca a forza quattro',

	async run(message : Message) {
		if(!isGameChannel(message.channel.id)) return;

		const { players, message : gameMessage } = await multiplayerGameConfigurator(message.channel as TextChannel,
			{
				gameName: 'forza 4',
				leader: message.author.id,
				leaderName: message.author.username,
				minPlayers: 2,
				maxPlayers: 2,
				debug: true,
			});

		if(players == []) {
			return;
		}

		const playerNames = [message.guild.members.cache.find((member) => member.id == players[0]).displayName, message.guild.members.cache.find((member) => member.id == players[1]).displayName];

		const board = Array.from('⬜'.repeat(6 * 7));
		let turn = 0;
		let tempPos = 3;

		const gameLoop = async () => {
			await render(board, tempPos, gameMessage, playerNames, turn % 2);
			const res = await input(board, tempPos, gameMessage, players, turn % 2);
			if(res.pos == -1) {
				turn = -1;
				return;
			}
			if(res.nextTurn) {
				tempPos = 3;
				turn++;
			}
			else {
				tempPos = res.pos;
			}
			if(!isWin(board, turn % 2 == 1 ? '🔴' : '🟡') && turn < board.length - 1) await gameLoop();
		};

		await gameLoop();

		let text = '';

		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 7; j++) {
				text += board[i * 7 + j];
			}
			text += '\n';
		}

		const embed = new MessageEmbed()
			.setTitle(`🎲 ${playerNames[0]} - ${playerNames[1]}`)
			.setDescription(text)
			.setFooter(`È il turno di ${playerNames[turn]}`)
			.setColor('GREEN');

		if(turn == -1) {
			embed.setFooter(`${players[turn % 2]} non ha risposto, vince ${playerNames[turn % 2 == 0 ? 1 : 0]}`);
		}
		if(turn == board.length - 1) {
			embed.setFooter(`${playerNames[0]} e ${playerNames[1]} hanno pareggiato!`);
		}
		else{
			embed.setFooter(`${playerNames[turn % 2 == 0 ? 1 : 0]} ha vinto!`);
		}

		await gameMessage.edit({ embeds : [embed], components: [] });
	},
};

const render = async (board : string[], pos : number, gameMessage : Message, playerNames : string[], turn : number) : Promise<void> => {
	const actionRows = [
		createButtonsRow(['⬅️', '⬇️', '➡️'], [], board.slice(0, 2).map((str) => str != '⬜')),
	];

	let text = `${'⬛'.repeat(pos)}${turn % 2 == 0 ? '🔴' : '🟡'}${'⬛'.repeat(6 - pos)}\n`;

	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 7; j++) {
			text += board[i * 7 + j];
		}
		text += '\n';
	}


	const embed = new MessageEmbed()
		.setTitle(`🎲 ${playerNames[0]} - ${playerNames[1]}`)
		.setDescription(text)
		.setColor('ORANGE')
		.setFooter(`È il turno di ${playerNames[turn]}`);
	await gameMessage.edit({ embeds: [ embed ], components : actionRows });
};

const input = async (board : string[], selected: number, gameMessage : Message, players : string[], turn : number) : Promise<{pos: number, nextTurn: boolean}> => {

	const disableButtons = async (...ids: number[]) => {
		const disabled = [false, false, false];

		ids.forEach(id => {
			if(id != -1) {
				disabled[id] = true;
			}
		});

		const actionRows = [
			createButtonsRow(['⬅️', '⬇️', '➡️'], [], disabled),
		];

		await gameMessage.edit({ components: actionRows });
	};

	if(selected == 0) {
		await disableButtons(0, board[selected] != '⬜' ? 1 : -1);
	}
	if(selected == 6) {
		await disableButtons(2, board[selected] != '⬜' ? 1 : -1);
	}
	if(board[selected] != '⬜') {
		await disableButtons(1);
	}

	const selectInput = +(await singleButtonInput(gameMessage, players[turn]));

	if(selectInput == 0) {
		selected--;
		return { pos: selected, nextTurn: false };
	}
	else if(selectInput == 2) {
		selected++;
		return { pos: selected, nextTurn: false };
	}
	else if(selectInput == 1) {
		let pos = selected;
		for (let i = 1; i <= 6; i++) {
			if(board[pos + 7] == '⬜') {
				pos += 7;
			}
			else {
				board[pos] = turn % 2 == 0 ? '🔴' : '🟡';
				return { pos: selected, nextTurn: true };
			}
		}
	}
	else {
		return { pos: -1, nextTurn: true };
	}
};


const isWin = (board : string[], turn : string) : boolean => {
	// Controllo righe
	for (let i = 0; i < 6; i++) {
		const row = [board[i * 7], board[i * 7 + 1], board[i * 7 + 2], board[i * 7 + 3], board[i * 7 + 4], board[i * 7 + 5], board[i * 7 + 6]];
		if(row.join('').includes(turn.repeat(4))) return true;
	}

	// Controllo colonne
	for (let i = 0; i < 7; i++) {
		const column = [board[i], board[7 + i], board[14 + i], board[21 + i], board[28 + i], board[35 + i]];
		if(column.join('').includes(turn.repeat(4))) return true;
	}

	// Controllo diagonale destra
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 4; j++) {
			const diagonal = [board[i * 7 + j], board[(i * 7 + j) + 8], board[(i * 7 + j) + 16], board[(i * 7 + j) + 24]];
			if(diagonal.join('') == turn.repeat(4)) return true;
		}
	}

	// Controllo diagonale sinistra
	for (let i = 4; i < 7; i++) {
		for (let j = 0; j < 4; j++) {
			const diagonal = [board[i * 7 + j], board[(i * 7 + j) + 6], board[(i * 7 + j) + 12], board[(i * 7 + j) + 18]];
			if(diagonal.join('') == turn.repeat(4)) return true;
		}
	}

	return false;
};


module.exports = connect4Command;