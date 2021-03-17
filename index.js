/* eslint-disable no-empty */
const { CommandoClient } = require('./discord.js-commando/src');
const firebase = require('firebase')
require("firebase/firestore");
const path = require('path');

const client = new CommandoClient({
  commandPrefix: "v.",
  owner: "820979452892020786"
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['music', 'Musica'],
    ['gifs', 'Gif'],
    ['other', 'Altro'],
    ['guild', 'Comandi del server']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
    prefix: false,
    commandState: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

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
    channel.send(`Ho ricevuto un nuovo ip per connettersi a: ${data.Motivo} (${data.Ip})`);
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
  if(message.content.toLowerCase() == "vaiolowser rincoglionito"){
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