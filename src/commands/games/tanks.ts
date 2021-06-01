import { Message, MessageEmbed, MessageReaction, ReactionCollector, User } from 'discord.js';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import { GameGuild } from '../../index';

module.exports = class TanksCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'tanks',
      aliases: ['tanks'],
      memberName: 'tanks',
      group: 'games',
      description: 'partita a tanks'
    });
  }

  //@ts-ignore
  async run(message : CommandoMessage) {
    if(message.channel.id != "830519380931510282") return;
    
    if((message.guild as GameGuild).gameData.currentGame != "") return;

    (message.guild as GameGuild).gameData = {currentGame: "tanks", minPlayers: 2, maxPlayers: 4, players: [{id: message.author.id, name: await message.guild.member(message.author) ? await message.guild.member(message.author).nickname : message.author.username}]}

    //Filtro per le reazioni
    const filter = async (reaction : MessageReaction, user : User) => {
        var testForUser = false;
        for(let element of (message.guild as GameGuild).gameData.players) {
            if(element.id == user.id) {
                testForUser = true;
                break;
            }
        }
        return ['♿', '✅'].includes(reaction.emoji.name) && !testForUser;
    };
    
    var toReply = await message.reply("Questo gioco è multigiocatore.\nPremi ✅ per aggregarti!");
    
    await toReply.react('✅');

    const collector = await toReply.createReactionCollector(await filter, { time: 20000, dispose: true});

    collector.on("collect", async (reaction : MessageReaction, user : User) => {
      if(reaction.emoji.name == '✅'){
        (message.guild as GameGuild).gameData.players.push({id: user.id, name: await message.guild.member(user) ? await message.guild.member(user).nickname : user.username});
        
        if((message.guild as GameGuild).gameData.players.length >= (message.guild as GameGuild).gameData.minPlayers){
          collector.resetTimer({time: 20000});
          await toReply.react("♿");
          if(!toReply.content.includes("♿"))
            await toReply.edit(toReply.content.replace("i!", "i!\nIl minimo di giocatori è raggiunto, premi ♿ per partire"));
        }
        else if((message.guild as GameGuild).gameData.players.length = (message.guild as GameGuild).gameData.maxPlayers){
          collector.stop();
        }
      }
      else if(reaction.emoji.name == "♿" && user.id == (message.guild as GameGuild).gameData.players[0].id){
        if((message.guild as GameGuild).gameData.players.length >= (message.guild as GameGuild).gameData.minPlayers){
          collector.stop();
        }
      }
    });

    collector.on("remove", async (reaction : MessageReaction, user : User) => {
      if(reaction.emoji.name == "✅"){
        (message.guild as GameGuild).gameData.players = (message.guild as GameGuild).gameData.players.filter(function(obj) {
          return obj.id != user.id;
        });

        if(toReply.content.includes("♿")){
          await toReply.edit(toReply.content.replace("i!\nIl minimo di giocatori è raggiunto, premi ♿ per partire", "i!"));
          toReply.reactions.cache.get("♿").remove();
        }
      }
    });

    await collector.on("end", async collected => {

        toReply.delete();
        if((message.guild as GameGuild).gameData.players.length < (message.guild as GameGuild).gameData.minPlayers) {
            (message.guild as GameGuild).gameData.currentGame = "";
            return message.say("Nessuno si è unito al gruppo");
        }


        var map : number[][]= [
          [1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 1, 1, 0, 1, 1, 0, 1],
          [1, 0, 1, 0, 0, 0, 1, 0, 1],
          [1, 0, 0, 0, 1, 0, 0, 0, 1],
          [1, 0, 1, 0, 0, 0, 1, 0, 1],
          [1, 0, 1, 1, 0, 1, 1, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]

        class Player{
          public id : string;
          public name : string;
          public colorId : number;
          public coords : {x: number, y: number}
          public lifes: number = 3;

          constructor(_id : string, _colorId : number, _coords : {x: number, y: number}, _name : string){
            this.id = _id;
            this.colorId = _colorId;
            this.coords = _coords;
            this.name = _name;
          }

          public move(direction : number){
            switch(direction){
              case 0:
                if(map[this.coords.y + 1][this.coords.x] == 0)
                  this.coords = {x: this.coords.x, y: this.coords.y + 1}
                return 
              case 1:
                if(map[this.coords.y][this.coords.x + 1] == 0)
                  this.coords = {x: this.coords.x + 1, y: this.coords.y}
                return 
              case 2:
                if(map[this.coords.y - 1][this.coords.x] == 0)
                  this.coords = {x: this.coords.x, y: this.coords.y - 1}
                return 
              case 3:
                if(map[this.coords.y][this.coords.x - 1] == 0)
                  this.coords = {x: this.coords.x - 1, y: this.coords.y}
                return 
            }
          }
        }

        var players : Player[] = [];

        for (let i = 0; i < (message.guild as GameGuild).gameData.players.length; i++) {
          var coord : any;
          switch (i) {
            case 0:
              coord = {x: 1, y: 1};
              break;
            case 1:
              coord = {x: 7, y: 1};
              break;
            case 2:
              coord = {x: 1, y: 7};
              break;
            case 4:
              coord = {x: 7, y: 7};
              break;
          }

          players[i] = (new Player((message.guild as GameGuild).gameData.players[i].id, i % 2 == 0 ? 1 : 3, coord, (message.guild as GameGuild).gameData.players[i].name))
        }

        var embed = new MessageEmbed();
        embed.setColor("#ff0000");
        embed.setTitle("🎲 Tanks");
        embed.setDescription(TanksCommand.render(map, players));
        embed.setFooter("Inizializzazione...");

        await message.say(embed).then(async (gameMessage : Message) => {

          await gameMessage.react("⬅️")
            .then(() => gameMessage.react("⬆️"))
            .then(() => gameMessage.react("➡️"))
            .then(() => gameMessage.react("⬇️"))
            .then(() => gameMessage.react("⏺️"))

          const gameReactionFilter =  async (reaction : MessageReaction, user : User) => {
            var testForUser = false;
            for(let i = 0; i < players.length; i++) {

                if(players[i].id == user.id && players[i].lifes > 0) {
                    testForUser = true;
                    break;
                }
            }
            return ['⬅️', '⬆️', '➡️', '⬇️', '⏺️'].includes(reaction.emoji.name) && testForUser;
          };


          var embed = new MessageEmbed();
          embed.setColor("#ff8300");
          embed.setTitle("🎲 Tanks");
          embed.setDescription(TanksCommand.render(map, players));
          embed.setFooter("Combattete!");

          await gameMessage.edit(embed);
          TanksCommand.gameLoop(message, gameMessage, gameReactionFilter, players, map, 0);
        })
    })
  }


  static gameLoop(message : CommandoMessage, gameMessage : Message, gameReactionFilter : any, players : any[], map : number[][], i : number){
    var gameColl = gameMessage.createReactionCollector(gameReactionFilter, {time: 1000});
    var forceUpdate = false;

    gameColl.on('collect', (reaction, user) => {

      if(user.id != gameMessage.author.id)
        reaction.users.remove(user.id);

      switch(reaction.emoji.name){
        case '⬆️':
          for (let i = 0; i < players.length; i++) {
            if(players[i].id == user.id){
              players[i].move(2);
              break;
            }
          }
          break;
        case '⬅️':
          for (let i = 0; i < players.length; i++) {
            if(players[i].id == user.id){
              players[i].move(3);
              break;
            }
          }
          break;
        case '➡️':
            for (let i = 0; i < players.length; i++) {
              if(players[i].id == user.id){
                players[i].move(1);
                break;
              }
            }
          break;
        case '⬇️':
          for (let i = 0; i < players.length; i++) {
            if(players[i].id == user.id){
              players[i].move(0);
              break;
            }
          }
          break;
        case '⏺️':
          const currentPlayer = players.findIndex((element : any) => element.id == user.id);
          var test = true;
          for (let i = 0; i < players.length; i++) {
            if(players[currentPlayer].id == user.id && test) { test = false; continue};

            const playerX = players[i].coords.x;
            const playerY = players[i].coords.y;

            if((playerX == players[currentPlayer].coords.x && playerY == players[currentPlayer].coords.y + 1) || (playerX == players[currentPlayer].coords.x && playerY == players[currentPlayer].coords.y - 1) || (playerX == players[currentPlayer].coords.x + 1 && playerY == players[currentPlayer].coords.y) || (playerX == players[currentPlayer].coords.x - 1 && playerY == players[currentPlayer].coords.y)){
              players[i].lifes--;
              forceUpdate = true;
            }
          }
          break;
      }
    }) 

    gameColl.on('end', async () => {
      var alive : string[] = [];
      for (let i = 0; i < players.length; i++) {
        const element = players[i];
        if(element.lifes > 0){
          alive.push(players[i].name);
        }
      }


      if(alive.length > 1){
        var renderedMap = TanksCommand.render(map, players);
        if(renderedMap != gameMessage.embeds[0].description + "\n" || forceUpdate){
          i = 0;
          var endEmbed = new MessageEmbed();
          endEmbed.setColor("#00ff00");
          endEmbed.setTitle("🎲 Tanks");
          endEmbed.setDescription(renderedMap);
          var footer =`${players[0].name} - ${players[0].lifes > 0 ? '❤️'.repeat(players[0].lifes) : '💀'}\n${players[1].name} - ${players[1].lifes > 0 ? '❤️'.repeat(players[1].lifes) : '💀'}`; 
          for (let i = 2; i < players.length; i++) {
            footer += `\n${players[i].name} - ${players[i].lifes > 0 ? '❤️'.repeat(players[i].lifes) : '💀'}`
          }
          endEmbed.setFooter(footer);
          gameMessage.edit(endEmbed);
        }
        else{
          i++;
        }
        if(i < 20){
          TanksCommand.gameLoop(message, gameMessage, gameReactionFilter, players, map, i);
        }
        else{
          var endEmbed = new MessageEmbed();
          endEmbed.setColor("#00ff00");
          endEmbed.setTitle("🎲 Tanks");
          endEmbed.setDescription(renderedMap);
          var footer =`Nessuno si è mosso per 10 secondi, pareggio!\n${players[0].name} - ${players[0].lifes > 0 ? '❤️'.repeat(players[0].lifes) : '💀'}\n${players[1].name} - ${players[1].lifes > 0 ? '❤️'.repeat(players[0].lifes) : '💀'}`; 
          for (let i = 2; i < players.length; i++) {
            footer += `\n${players[i].name} - ${players[i].lifes > 0 ? '❤️'.repeat(players[i].lifes) : '💀'}`
          }
          endEmbed.setFooter(footer);
          await gameMessage.reactions.removeAll();
          await gameMessage.edit(endEmbed);
          return (message.guild as GameGuild).gameData.currentGame = "";
        }
      }
      else{
        var endEmbed = new MessageEmbed();
        endEmbed.setColor("#00ff00");
        endEmbed.setTitle("🎲 Tanks");
        endEmbed.setDescription(TanksCommand.render(map, players));
        endEmbed.setFooter(`Ha vinto ${alive[0]}`);
        await gameMessage.reactions.removeAll();
        await gameMessage.edit(endEmbed);
        return (message.guild as GameGuild).gameData.currentGame = "";
      }
    });
  }

  static render(map : number[][], players : any[]) : string{
    var rendered = "";
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        var num = map[y][x];

        for (let i = 0; i < players.length; i++) {
          const element = players[i];
          if(element.coords.x == x && element.coords.y == y && element.lifes > 0){
            num = element.colorId + 2;
            break;
          }
        }

        rendered += TanksCommand.numToEmojii(num);
      }
      rendered += "\n";
    }

    return rendered;
  }


  static numToEmojii(num : number) : string{
    if(num == 0) return "⬛";
    if(num == 1) return "⬜";
    if(num == 2) return "🟦";
    if(num == 3) return "🟥";
    if(num == 4) return "🟩";
    if(num == 5) return "🟪";
  }
};
