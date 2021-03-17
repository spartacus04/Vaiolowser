const fetch = require('node-fetch');
const { Command } = require('../../discord.js-commando/src');
const { MessageEmbed } = require('discord.js');


module.exports = class CatCommand extends Command {
  constructor(client) {
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

  run(message) {
    try {
      var url = new URL(`https://www.reddit.com/r/geologyporn.json?sort=hot&t=week`),
        params = {limit: 800}
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
      fetch(url)
      .then(body => body.json())
      .then((body) => {
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return sg.channel.send('I meme golosi sono finiti, torna a casa ora');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new MessageEmbed();
        embed
        .setColor(0x00A2E8)
        .setTitle(allowed[randomnumber].data.title)
        .setImage(allowed[randomnumber].data.url)
        .setFooter(`Postato da u/${allowed[randomnumber].data.author} su r/geologyporn (${allowed[randomnumber].data.ups} upvotes)`)
        message.channel.send(embed)
      }).catch(function (err){ console.log(err)});
      
    } catch (err) {
      message.say("Bruh non ho trovato un sasso");
      console.log(err);
    } finally {
      message.channel.stopTyping();
    }
  }
};
