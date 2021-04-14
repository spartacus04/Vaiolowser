import fetch from 'node-fetch';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import { MessageEmbed, TextChannel } from 'discord.js';
import { URL } from 'url';


module.exports = class CatCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'cat',
      aliases: ['cat-pic', 'cats', 'rock'],
      group: 'other',
      memberName: 'cat',
      description: 'Risponde con un immagine di un sasso',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    try {
      var query = new URL(`https://www.reddit.com/r/geologyporn.json?sort=hot&t=week`),
        params = {limit: 800}
      Object.keys(params).forEach(key => query.searchParams.append(key, ((800 as any) as string)))
      fetch(query)
      .then(body => body.json())
      .then((body) => {
        const allowed = (message.channel as TextChannel).nsfw ? body.data.children : body.data.children.filter((post : any)=> !post.data.over_18);
        if (!allowed.length) return message.channel.send('I meme golosi sono finiti, torna a casa ora');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new MessageEmbed();
        embed
        .setColor(0x00A2E8)
        .setTitle(allowed[randomnumber].data.title)
        .setImage(allowed[randomnumber].data.url)
        .setFooter(`Postato da u/${allowed[randomnumber].data.author} su r/geologyporn (${allowed[randomnumber].data.ups} upvotes)`)
        message.channel.send(embed)
      }).catch(function (err){
        message.say("c'è stato un errore");
        console.log(err);
      });
      
    } catch (err) {
      message.say("Bruh non ho trovato un sasso");
      console.log(err);
    } finally {
      message.channel.stopTyping();
    }
  }
};
