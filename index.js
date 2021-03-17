/* eslint-disable no-empty */
const { CommandoClient } = require('./discord.js-commando/src');
const firebase = require('firebase')
require("firebase/firestore");
const path = require('path');

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
  const doc = firestore.collection('Vaiolowser').doc('NgrokIp');

  const observer = doc.onSnapshot(docSnapshot => {
    const data = docSnapshot.data();
    const channel = client.channels.cache.find(channel => channel.id === "821676557465681920")
    if(ngrok){
      channel.send(`Ho ricevuto un nuovo ip per connettersi a: ${data.Motivo} (${data.Ip})`);
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