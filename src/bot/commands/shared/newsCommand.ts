import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import { logger } from '@logger';
import { NEWS_KEY } from '@config';

export const newsCommand = async (message: Message, opts: { source?: string, country?: string }) => {
	try {
		const response = await fetch(
			`https://newsapi.org/v2/top-headlines?pageSize=5&apiKey=${NEWS_KEY}${opts.source ? `&sources=${opts.source}` : ''}${opts.country ? `&country=${opts.country}` : ''}}`,
		);

		const data = (await response.json()) as any;
		logger.verbose(data);

		const articles = data.articles;

		const embedList = articles.map(processArticle);

		await (<TextChannel>message.channel).send({ embeds: embedList });
	}
	catch (err) {
		logger.error(err);
		return await (<TextChannel>message.channel).send('Impossibile inviare le notizie');
	}
};

const processArticle = (article: any): EmbedBuilder => {
	return new EmbedBuilder()
		.setColor('#FF4F00')
		.setTitle(article.title)
		.setURL(article.url)
		.setAuthor({ name: article.author })
		.setDescription(article.description)
		.setThumbnail(article.urlToImage)
		.setTimestamp(new Date(article.publishedAt))
		.setFooter({ text: 'NewsAPI.org' });
};