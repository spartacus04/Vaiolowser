import { Command } from '../../config';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { logger } from '../../logger';

const catCommand : Command = {
	name: 'cat',
	aliases: ['catpic', 'rock'],
	description: 'Risponde con un immagine di un sasso',

	async run(message : Message) {
		try {
			await message.channel.sendTyping();
			const res = await fetch('https://www.reddit.com/r/geologyporn.json?sort=top&t=week&limit=800');
			const data = await res.json() as any;
			logger.verbose(data);

			const allowed : any[] = data.data.children.filter((post : any) => !post.data.over_18);

			if(!allowed.length) return message.channel.send('I meme golosi sono finiti, torna a casa ora');

			const postData = allowed[Math.floor(Math.random() * allowed.length)].data;

			const embed = new MessageEmbed()
				.setColor('#00A2E8')
				.setTitle(postData.title)
				.setImage(postData.url)
				.setFooter({ text: `Postato da u/${postData.author} su r/geologyporn (${postData.ups} upvotes)` });

			await message.channel.send({ embeds : [ embed ] });
		}
		catch (err) {
			logger.error(err);
			await message.channel.send('Il gatto è gay a quanto pare');
		}
	},
};

module.exports = catCommand;