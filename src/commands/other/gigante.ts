import { Command } from '../../config';
import { Message } from 'discord.js';

const giganteCommand : Command = {
	name: 'gigante',
	aliases: ['giganteomofobico', 'gigante-omofobico'],
	description: 'Invia un gigante omofobico',

	async run(message : Message) {
		await message.channel.sendTyping();
		await message.channel.send({ files: ['resources/images/gigante.jpeg'] });
	},
};

module.exports = giganteCommand;