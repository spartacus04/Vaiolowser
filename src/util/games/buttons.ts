import { MessageActionRow, MessageButton } from 'discord.js';

export const createButtonsRow = (arr : string[], id: number[] = [], disabled : boolean[] = []) : MessageActionRow => {

	const actionRow = new MessageActionRow();

	for (let i = 0; i < arr.length; i++) {
		actionRow.addComponents(new MessageButton()
			.setLabel(arr[i])
			.setStyle('PRIMARY')
			.setDisabled(disabled[i] || false)
			.setCustomId((id[i] || i).toString()));
	}
	return actionRow;
};
