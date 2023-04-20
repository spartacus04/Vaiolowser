import { Message } from 'discord.js';
import { Command } from '@commandHandler';
import { redditCommand } from '@botcommands/shared';

const memeCommand : Command = {
	name: 'meme',
	description: 'Invia un meme da subreddit italiani',

	async run(message : Message) { redditCommand(message, ['PrequelMemes', 'memesITA', 'gaiming']); },
};

module.exports = memeCommand;