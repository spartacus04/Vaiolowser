import fs from 'node:fs';
import path from 'node:path';
import { Message } from 'discord.js';
import { Command } from '@commandHandler';

const tposeCommand : Command = {
	name: 'tpose',
	description: 'Risponde con una T-Pose',

	async run(message : Message) {
		await message.channel.sendTyping();
		const files = fs.readdirSync(path.join(process.cwd(), '/resources/images/tpose'));
		const fileName = files[Math.floor(Math.random() * files.length)];
		await message.channel.send({ files: [`resources/images/tpose/${fileName}`] });
	},
};

module.exports = tposeCommand;