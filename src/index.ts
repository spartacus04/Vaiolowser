import { CommandoClient, CommandoGuild } from 'discord.js-commando-it';
import firebase from 'firebase';
require("firebase/firestore");
import * as path from 'path';
import Discord, { Channel, Structures, TextChannel } from 'discord.js';
import * as Cron from "cron";
import * as fs from 'fs';


export class GameGuild extends CommandoGuild {
  constructor(client : any, data : any) {
    super(client, data);
    this.gameData = {
      currentGame: "",
      minPlayers: 0,
      maxPlayers : 0,
      players: [{ name: null, id: null}]
    };
  }

  public gameData : { currentGame : string, minPlayers : number, maxPlayers : number, players : {name : string, id : string}[]};
}

Structures.extend('Guild', function() {
  return GameGuild;
});

const client = new CommandoClient({
  commandPrefix: "v.",
  owner: "465954478852669460"
});

client.registry
.registerDefaultTypes()
.registerGroups([
  ['games', 'giochi'],
  ['gifs', 'Gif'],
  ['other', 'Altro']
])
.registerDefaultGroups()
.registerDefaultCommands({
  eval: false,
  prefix: false,
  commandState: false
})
.registerCommandsIn(path.join(__dirname, 'commands'));


var ngrok = false;
client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity("le tue urla", {
    type: 'LISTENING',
    url: 'https://youtu.be/pnHg892Xwpk'
  });

  
  //Indirizzi IP di Ngrok
  const doc = firestore.collection('Vaiolowser-Ngrok-Ips');

  const observer = doc.onSnapshot(async function(docSnapshot) {
    const channel = client.channels.cache.find(channel => channel.id === "821676557465681920");
    if(ngrok){
      docSnapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
          var data = change.doc.data();
          var embed = new Discord.MessageEmbed();
          embed.setAuthor('Nuovo IP');
          embed.setColor('#00ff00');
          embed.setTitle(data.Game);
          var orario = new Date();
          embed.setFooter(`Inviato alle ${orario.getHours() + 1}:${orario.getMinutes()}`);
          if(data.Game.toLowerCase().includes('terraria')){
            if(data.Game.toLowerCase().includes('moddato') || data.Game.toLowerCase().includes('calamity')){
              embed.attachFiles(['resources/images/serverImages/Calamity.png']);
              embed.setThumbnail('attachment://Calamity.png');
            }
            else{
              embed.attachFiles(['resources/images/serverImages/Terraria.png']);
              embed.setThumbnail('attachment://Terraria.png');
            }
            embed.setDescription(`Ip : ${data.Ip}\nPorta : ${data.Port}`);
          }
          else if(data.Game.toLowerCase().includes('minecraft')){
            if(data.Game.toLowerCase().includes('moddato')){
              embed.attachFiles(['resources/images/serverImages/Moddato.png']);
              embed.setThumbnail('attachment://Moddato.png');
            }
            else if(data.Game.toLowerCase().includes('sevtech')){
              embed.attachFiles(['resources/images/serverImages/Sevtech.png']);
              embed.setThumbnail('attachment://Sevtech.png');
            }
            else if(data.Game.toLowerCase().includes('svf')){
              embed.attachFiles(['resources/images/serverImages/svf.png']);
              embed.setThumbnail('attachment://svf.png');
            }
            else{
              embed.attachFiles(['resources/images/serverImages/Vanilla.png']);
              embed.setThumbnail('attachment://Vanilla.png');
            }
            embed.setDescription(`${data.Ip}:${data.Port}`);
          }
          (channel as TextChannel).send(embed);
          change.doc.ref.delete();
        }
      })
    }
    else{
      ngrok = true;
    }
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
});

var firebaseConfig = {
  apiKey: process.env.firebaseAPI,
  authDomain: "prosciutthanos-events.firebaseapp.com",
  projectId: "prosciutthanos-events",
  storageBucket: "prosciutthanos-events.appspot.com",
  messagingSenderId: "256859147490",
  appId: "1:256859147490:web:6e5ac97b4bd69de936a2bb",
  measurementId: "G-4CCNXP5VF5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

client.on('message', message => {
  if(message.content.toLowerCase() == "vaiolowser rincoglionito" || message.content.toLowerCase() == "vaiolower finocchio"){
    message.channel.send("No tu");
  }
});

async function minecraftServerBuildTheme(){
  let buildbBattleThemes = JSON.parse(fs.readFileSync(
    'resources/buildBattleThemes.json',
    'utf8'
  ));

  let battleTheme = buildbBattleThemes[Math.floor(Math.random() * (buildbBattleThemes.length + 1))];

  const doc = firestore.collection('Build-Battle-Theme');

  await doc.add({theme: battleTheme});

  const channel = client.channels.cache.find(channel => channel.id === "821676557465681920");

  var embed = new Discord.MessageEmbed();
  embed.setAuthor('Gara di building');
  embed.setColor('#00ff00');
  embed.setTitle(battleTheme);
  embed.attachFiles(['resources/images/serverImages/Bricks.png']);
  embed.setThumbnail('attachment://Bricks.png');
  embed.setDescription("Il tema della settimana è " + battleTheme);
  var orario = new Date();
  embed.setFooter(`Inviato alle ${orario.getHours() + 1}:${orario.getMinutes()}`);

  await (channel as TextChannel).send(embed);
}

let buildBattle = new Cron.CronJob('00 00 9 * * 1', minecraftServerBuildTheme);
buildBattle.start();

client.login(process.env.token);