import { CollectorFilter, Message, MessageComponentInteraction } from 'discord.js';

export const singleButtonInput = (message : Message, ...allowedUsers : string[]) : Promise<string> => {
	return new Promise<string>((resolve) => {
		const filter : CollectorFilter<[MessageComponentInteraction]> = i =>
			(allowedUsers.length != 0 ? allowedUsers.includes(i.user.id) : true);

		const collector = message.channel.createMessageComponentCollector({ filter, message, max: 1, time: 15000 });

		collector.on('collect', i => {
			resolve(i.customId);
		});

		collector.on('end', i => {
			resolve(i.size > 0 ? i.first().customId : '-1');
		});
	});
};