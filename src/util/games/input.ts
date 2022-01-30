import { CollectorFilter, Interaction, Message } from 'discord.js';

export const singleButtonInput = (message : Message, ...allowedUsers : string[]) : Promise<string> => {
	return new Promise<string>((resolve) => {
		const filter : CollectorFilter<[Interaction]> = i =>
			(allowedUsers.length != 0 ? allowedUsers.includes(i.user.id) : true);

		const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', filter, max: 1, time: 15000 });

		collector.on('collect', i => {
			resolve(i.id);
		});

		collector.on('end', i => {
			resolve(i.size > 0 ? i.first().id : '-1');
		});
	});
};