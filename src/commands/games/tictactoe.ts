import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import { Console } from 'node:console';
import { GameGuild } from '../../index';

module.exports = class TictactoeCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'tictactoe',
      aliases: ['tictactoe', 'tris', 'ttt'],
      memberName: 'tictactoe',
      group: 'games',
      description: 'partita a tris'
    });
  }

  //@ts-ignore
  async run(message : CommandoMessage) {
    if(message.channel.id != "830519380931510282") return;
    
    if((message.guild as GameGuild).gameData.currentGame != "") return;

    (message.guild as GameGuild).gameData = {currentGame: "ttt", minPlayers: 2, maxPlayers: 2, players: [{id: message.author.id, name: await message.guild.member(message.author) ? await message.guild.member(message.author).nickname : message.author.username}]}

    //Filtro per le reazioni
    const filter = async (reaction : MessageReaction, user : User) => {
        var testForUser = false;
        for(let element of (message.guild as GameGuild).gameData.players) {
            if(element.id == user.id) {
                testForUser = true;
                break;
            }
        }
        return ['✅'].includes(reaction.emoji.name) && !testForUser;
    };
    
    var toReply = await message.reply("Questo gioco è multigiocatore.\nPremi ✅ per aggregarti!");
    
    await toReply.react('✅');

    const collector = await toReply.createReactionCollector(await filter, { time: 10000 });

    collector.on("collect", async (reaction : MessageReaction, user : User) => {
      (message.guild as GameGuild).gameData.players.push({id: user.id, name: await message.guild.member(user) ? await message.guild.member(user).nickname : user.username});
      
      if((message.guild as GameGuild).gameData.players.length = (message.guild as GameGuild).gameData.maxPlayers){
        collector.stop();
      }
    });

    collector.on("remove", async (reaction : MessageReaction, user : User) => {
        (message.guild as GameGuild).gameData.players = (message.guild as GameGuild).gameData.players.filter(function(obj) {
            return obj.id != user.id;
        });
    });

    await collector.on("end", async collected => {

        toReply.delete();
        if((message.guild as GameGuild).gameData.players.length < (message.guild as GameGuild).gameData.minPlayers) {
            (message.guild as GameGuild).gameData.currentGame = "";
            return message.say("Nessuno si è unito al gruppo");
        }

        var board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        var gameWinner = "";
        var reactionEmojiis = ["↖️", "⬆️", "↗️", "⬅️", "⏺️", "➡️", "↙️", "⬇️", "↘️"]
        var turn = 0;

        var embed = new MessageEmbed();
        embed.setColor("#ff8300");
        embed.setTitle(`🎲 ${(message.guild as GameGuild).gameData.players[0].name} - ${(message.guild as GameGuild).gameData.players[1].name}`);
        embed.setDescription(TictactoeCommand.drawBoard(board));
        embed.setFooter("È il turno di " + (message.guild as GameGuild).gameData.players[turn].name);

        await message.say(embed).then(async (gameMessage : Message) => {

          do{
            var embed = new MessageEmbed();
            embed.setColor("#ff8300");
            embed.setTitle(`🎲 ${(message.guild as GameGuild).gameData.players[0].name} - ${(message.guild as GameGuild).gameData.players[1].name}`);
            embed.setDescription(TictactoeCommand.drawBoard(board));
            embed.setFooter("È il turno di " + (message.guild as GameGuild).gameData.players[turn % 2].name);

            await gameMessage.edit(embed).then(async () => {

              for (let i = 0; i < 9; i++) {
                if(board[i] == 0)
                  await gameMessage.react(reactionEmojiis[i]);
              }

              const reactionFilter = (reaction : MessageReaction, user : User) => {

                var allowedEmojiis : string[] = [];
                for (let i = 0; i < 9; i++) {
                  if(TictactoeCommand.numToEmojii(board[i]) == "⬜"){
                    allowedEmojiis.push(reactionEmojiis[i]);                
                  }
                }
                return allowedEmojiis.includes(reaction.emoji.name) && user.id == (message.guild as GameGuild).gameData.players[turn % 2].id;
              };


              await gameMessage.awaitReactions(reactionFilter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                var collectedReaction = collected.first();
                collectedReaction.message.reactions.removeAll();
                board[reactionEmojiis.indexOf(collectedReaction.emoji.name)] = (turn % 2 == 0 ? 1 : 2);

                //if(TictactoeCommand.checkForDraw(board)){
                if(turn == 8){
                  gameWinner = `${(message.guild as GameGuild).gameData.players[turn % 2].name} e ${(message.guild as GameGuild).gameData.players[(turn + 1) % 2].name} hanno pareggiato`;
                }

                if(TictactoeCommand.checkForWin(board, turn % 2 == 0 ? 1 : 2)){
                  gameWinner = `${(message.guild as GameGuild).gameData.players[turn % 2].name} ha vinto!`;
                }

                turn++;
              }).catch(async () =>{
                gameWinner = `${(message.guild as GameGuild).gameData.players[turn % 2].name} non ha risposto, vince automaticamente ${(message.guild as GameGuild).gameData.players[(turn + 1) % 2].name}!`;
              });

            });
          } while(gameWinner == "");


          var endEmbed = new MessageEmbed();
          endEmbed.setColor("#00ff00");
          endEmbed.setTitle(`🎲 ${(message.guild as GameGuild).gameData.players[0].name} - ${(message.guild as GameGuild).gameData.players[1].name}`);
          endEmbed.setDescription(TictactoeCommand.drawBoard(board));
          endEmbed.setFooter(gameWinner);
          await gameMessage.reactions.removeAll();
          await gameMessage.edit(endEmbed);
          return (message.guild as GameGuild).gameData.currentGame = "";
        })
    })
  }

  static drawBoard(values : number[]) : string{
    var board = "⬛⬛⬛⬛⬛\n"
    for (let i = 0; i < 3; i++) {
      board += "⬛"
      for (let j = 0; j < 3; j++) {
        board += TictactoeCommand.numToEmojii(values[i * 3 + j]);
      }
      board += "⬛\n";
    }
    board += "⬛⬛⬛⬛⬛"
    return board;
  }

  static numToEmojii(value : number) : string{
    return value == 0 ? "⬜" : (value == 1 ? "❌" : "🔵")
  }

  static checkForWin(values : number[], playerToCheck : number) : boolean{
    //Check for rows
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(values[i * 3 + j] != playerToCheck) break;
        if(j == 2) return true;
      }
    }

    //Check columns
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(values[i + j * 3] != playerToCheck) break;
        if(j == 2) return true;
      }
    }

    //Check diagonal
    if(values[0] == playerToCheck && values[4] == playerToCheck && values[8] == playerToCheck)
      return true;

    if(values[2] == playerToCheck && values[4] == playerToCheck && values[6] == playerToCheck)
      return true;

    return false;
  }

  static checkForDraw(values : number[]) : boolean{

    var tempValues = values;

    //Check for rows
    for (let i = 0; i < 3; i++) {

      var currentPiece = values[i * 3];

      for (let j = 0; j < tempValues.length; j++) {
         if(tempValues[j] == 0) tempValues[j] = currentPiece;
      }
      
      for (let j = 0; j < 3; j++) {
        if(values[i * 3 + j] != currentPiece)
          return false;
      }
    }

    var tempValues = values;

    //Check columns
    for (let i = 0; i < 3; i++) {

      var currentPiece = values[i];

      for (let j = 0; j < tempValues.length; j++) {
        if(tempValues[j] == 0) tempValues[j] = currentPiece;
      }

      for (let j = 0; j < 3; j++) {
        if(values[i + j * 3] != currentPiece)
          return false;
      }
    }

    var tempValues = values;

    for (let i = 0; i < tempValues.length; i++) {
      if(tempValues[i] == 0) tempValues[i] = values[0];
    }

    //Check diagonal
    if(tempValues[4] == values[0] && tempValues[8] == values[0])
      return false;

    var tempValues = values;

    for (let i = 0; i < tempValues.length; i++) {
      if(tempValues[i] == 0) tempValues[i] = values[2];
    }

    if(tempValues[4] == values[2] && tempValues[6] == values[2])
      return false;

    return true;
  }
};
