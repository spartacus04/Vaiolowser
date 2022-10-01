import { Command } from '../../config';
import { Message, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { logger } from '../../logger';

const memeCommand : Command = {
	name: 'meme',
	description: 'Invia un meme da subreddit italiani',

	async run(message : Message) {
		try {
			const subReddits = ['PrequelMemes', 'memesITA', 'gaiming' ];

			const subreddit = subReddits[Math.floor(Math.random() * subReddits.length)];
			await message.channel.sendTyping();
			const res = await fetch(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week&limit=800`);
			const data = await res.json() as any;
			logger.verbose(data);

			const allowed : any[] = data.data.children.filter((post : any) => !post.data.over_18);

			if(!allowed.length) return message.channel.send('I meme golosi sono finiti, torna a casa ora');

			const postData = allowed[Math.floor(Math.random() * allowed.length)].data;

			const embed = new EmbedBuilder()
				.setColor('#00A2E8')
				.setTitle(postData.title)
				.setImage(postData.url)
				.setFooter({ text: `Postato da u/${postData.author} su r/${subreddit} (${postData.ups} upvotes)` });

			await message.channel.send({ embeds : [ embed ] });
		}
		catch (err) {
			logger.error(err);
			await message.channel.send('Il meme è gay a quanto pare');
		}
	},
};

module.exports = memeCommand;