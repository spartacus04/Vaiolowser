import { Message, EmbedBuilder } from 'discord.js';
import { logger } from '@logger';
import { Command } from '@commandHandler';

const insultCommand : Command = {
	name: 'insult',
	description: 'Invia un insulto in tedesco',

	async run(message : Message) {
		try {
			const res = await fetch('https://evilinsult.com/generate_insult.php?lang=de&type=json');
			const data = await res.json() as any;
			logger.verbose(data);

			const embed = new EmbedBuilder()
				.setColor('#E41032')
				.setTitle('Insulto')
				.setDescription(data.insult)
				.setURL('https://evilinsult.com');

			return message.channel.send({ embeds : [ embed ] });
		}
		catch (err) {
			logger.error(err);
			message.channel.send('Bruh non va : sob:');
		}
	},
};

module.exports = insultCommand;