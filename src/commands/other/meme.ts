import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import { MessageEmbed, TextChannel } from 'discord.js';
import fetch from 'node-fetch';
import { URL } from 'url';

module.exports = class RandomNumberCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'meme',
      aliases: ['meme'],
      memberName: 'meme',
      group: 'other',
      description: 'Invia un Meme dai subreddit preferiti di sistone'
    });
  }

  //@ts-ignore
  async run(message : CommandoMessage) {
    let reddit = [
        "PrequelMemes",
        "memesITA",
        "gaiming"
    ]

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    message.channel.startTyping();

    var url = new URL(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week`),
      params = {limit: 800}
    Object.keys(params).forEach(key => url.searchParams.append(key, ((800 as any) as string)))
    return fetch(url)
    .then(body => body.json())
    .then((body) => {
      const allowed = (message.channel as TextChannel).nsfw ? body.data.children : body.data.children.filter((post : any)=> !post.data.over_18);
      if (!allowed.length) return message.say('I meme golosi sono finiti, torna a casa ora');
      const randomnumber = Math.floor(Math.random() * allowed.length)
      const embed = new MessageEmbed();
      embed
      .setColor(0x00A2E8)
      .setTitle(allowed[randomnumber].data.title)
      .setImage(allowed[randomnumber].data.url)
      .setFooter(`Postato da u/${allowed[randomnumber].data.author} su r/${subreddit} (${allowed[randomnumber].data.ups} upvotes)`)
      message.channel.stopTyping();
      message.channel.send(embed)
    }).catch(function (err){ console.log(err)});

  }
};
