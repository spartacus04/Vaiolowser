import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';
import { GameGuild } from '../../index';

module.exports = class Connect4Command extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'connect4',
      aliases: ['connect4', 'c4'],
      memberName: 'connect4',
      group: 'games',
      description: 'partita a forza 4'
    });
  }

  //@ts-ignore
  async run(message : CommandoMessage) {
    if(message.channel.id != "830519380931510282") return;
    
    if((message.guild as GameGuild).gameData.currentGame != "") return;

    (message.guild as GameGuild).gameData = {currentGame: "c4", minPlayers: 2, maxPlayers: 2, players: [{id: message.author.id, name: await message.guild.member(message.author) ? await message.guild.member(message.author).nickname : message.author.username}]}

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

        var board : number[][] = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
        var gameWinner = "";
        var reactionEmojiis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"]
        var turn = 0;

        var embed = new MessageEmbed();
        embed.setColor("#ff0000");
        embed.setTitle(`🎲 ${(message.guild as GameGuild).gameData.players[0].name} - ${(message.guild as GameGuild).gameData.players[1].name}`);
        embed.setDescription(Connect4Command.drawBoard(board));
        embed.setFooter("Inizializzazione...");

        

        await message.say(embed).then(async (gameMessage : Message) => {

          for (let i = 0; i < 7; i++) {
            await gameMessage.react(reactionEmojiis[i]);
          }

          do{
            var embed = new MessageEmbed();
            embed.setColor("#ff8300");
            embed.setTitle(`🎲 ${(message.guild as GameGuild).gameData.players[0].name} - ${(message.guild as GameGuild).gameData.players[1].name}`);
            embed.setDescription(Connect4Command.drawBoard(board));
            embed.setFooter("È il turno di " + (message.guild as GameGuild).gameData.players[turn % 2].name);

            await gameMessage.edit(embed).then(async () => {

              //Sistema di reazioni

              const reactionFilter = (reaction : MessageReaction, user : User) => {
                var allowedEmojiis : string[] = [];
                for (let i = 0; i < 7; i++) {
                  if(board[0][i] == 0){
                    allowedEmojiis.push(reactionEmojiis[i]);
                  }
                }
                return allowedEmojiis.includes(reaction.emoji.name) && user.id == (message.guild as GameGuild).gameData.players[turn % 2].id;
              };

              await gameMessage.awaitReactions(reactionFilter, { max: 1, time: 30000, errors: ['time'] }).then(async collected => {
                //Esegui ogni turno
                var collectedReaction = collected.first();
                await collectedReaction.message.reactions.resolve(collected.first()).users.remove((message.guild as GameGuild).gameData.players[turn % 2].id);

                for (let i = 0; i < 6; i++) {
                  const j = reactionEmojiis.indexOf(collectedReaction.emoji.name);
                  
                  if(board[i][j] == 0 && (i == 5 ? true : board[i + 1][j] != 0)){
                    board[i][reactionEmojiis.indexOf(collectedReaction.emoji.name)] = (turn % 2 == 0 ? 1 : 2);
                    if(i == 0) {
                      collectedReaction.message.reactions.resolve(collected.first()).users.remove("820995455231197235");
                    }
                    break;
                  } 
                }

                if(turn == 41){
                  gameWinner = `${(message.guild as GameGuild).gameData.players[turn % 2].name} e ${(message.guild as GameGuild).gameData.players[(turn + 1) % 2].name} hanno pareggiato`;
                }

                if(Connect4Command.checkForWin(board, turn % 2 == 0 ? 1 : 2)){
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
          endEmbed.setDescription(Connect4Command.drawBoard(board));
          endEmbed.setFooter(gameWinner);
          await gameMessage.reactions.removeAll();
          await gameMessage.edit(endEmbed);
          return (message.guild as GameGuild).gameData.currentGame = "";
        })
    })
  }

  static drawBoard(board : number[][]) : string{
    var newBoard = "";
    for (let i = 0; i < board.length; i++) {
      newBoard += "⬛"
      for (let j = 0; j < board[i].length; j++) {
        newBoard += Connect4Command.numToEmojii(board[i][j]);
      }
      newBoard += "⬛\n"
    }
    newBoard += "⬛⬛⬛⬛⬛⬛⬛⬛⬛";
    return newBoard;
  }

  static numToEmojii(value : number) : string{
    return value == 0 ? "⬜" : (value == 1 ? "🟡" : "🔵")
  }

  static checkForWin(board : number[][], player : number) : boolean{

    //Controllo delle righe

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < 4; j++) {
        if(board[i][j] == player && board[i][j + 1] == player && board[i][j + 2] == player && board[i][j + 3] == player)
          return true;
      }
    }

    //Controllo delle colonne

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < 3; j++) {
        if(board[j][i] == player && board[j + 1][i] == player && board[j + 2][i] == player && board[j + 3][i] == player)
          return true;
      }      
    }

    //Controllo diagonale destra
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if(board[i][j] == player && board[i + 1][j + 1] == player && board[i + 2][j + 2] == player && board[i + 3][j + 3] == player)
          return true;
      }      
    }

    //Controllo diagonale sinistra
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 7; j++) {
        if(board[i][j] == player && board[i + 1][j - 1] == player && board[i + 2][j - 2] == player && board[i + 3][j - 3] == player)
          return true;
      }      
    }

    return false;
  }
};
