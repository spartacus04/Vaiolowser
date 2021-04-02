/* eslint-disable no-empty */
const { CommandoClient } = require('./discord.js-commando/src');
const minecraftPing = require('minecraft-server-ping');
const firebase = require('firebase')
require("firebase/firestore");
const path = require('path');
const Discord = require('discord.js');

const client = new CommandoClient({
  commandPrefix: "v.",
  owner: "465954478852669460"
});

client.registry
.registerDefaultTypes()
.registerGroups([
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
          data = change.doc.data();
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
            else if(data.Game.toLowerCase().includes('svl')){
              embed.attachFiles(['resources/images/serverImages/svl.png']);
              embed.setThumbnail('attachment://svl.png');
            }
            else{
              embed.attachFiles(['resources/images/serverImages/Vanilla.png']);
              embed.setThumbnail('attachment://Vanilla.png');
            }
            embed.setDescription(`${data.Ip}:${data.Port}`);
          }
          channel.send(embed);
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

client.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    !newState.channelID &&
    newState.guild.musicData.songDispatcher &&
    newState.member.user.id == client.user.id
  ) {
    newState.guild.musicData.queue.length = 0;
    newState.guild.musicData.songDispatcher.end();
    return;
  }
  if (
    newState.member.user.bot &&
    newState.channelID &&
    newState.member.user.id == client.user.id &&
    !newState.selfDeaf
  ) {
    newState.setSelfDeaf(true);
  }
});

client.login(process.env.token);