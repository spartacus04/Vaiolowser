import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const createButtonsRow = (arr : string[], id: number[] = [], disabled : boolean[] = []) : ActionRowBuilder<ButtonBuilder> => {

	const actionRow = new ActionRowBuilder<ButtonBuilder>();

	for (let i = 0; i < arr.length; i++) {
		actionRow.addComponents(new ButtonBuilder()
			.setLabel(arr[i])
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled[i] || false)
			.setCustomId((id[i] || i).toString()));
	}
	return actionRow;
};
