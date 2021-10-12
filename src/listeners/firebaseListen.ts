import { getApp } from '../config/firebase';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { MessageAttachment, MessageEmbed, TextChannel } from 'discord.js';
import { client } from '../config';

const app = getApp();
const firestore = getFirestore(app);

const col = collection(firestore, 'Vaiolowser-Ngrok-Ips');

const channel = client.channels.cache.find(c => c.id == '821676557465681920') as TextChannel;

let flag = false;

onSnapshot(col, async snapshot => {
	snapshot.docChanges().forEach(async obj => {
		if(flag) {
			if(obj.type == 'added' && channel) {
				console.log(channel);
				await channel.sendTyping();
				const data = obj.doc.data();
				const embed = new MessageEmbed()
					.setAuthor('Nuovo indirizzo IP')
					.setColor('GREEN')
					.setTitle(data.game)
					.setFooter(`Inviato alle ${new Date().getHours()}:${new Date().getMinutes()}`);
				if(data.image) {
					const file = new MessageAttachment(Buffer.from(data.image, 'base64'), 'serverImage.png');
					embed.setThumbnail('attachment://serverImage.png');
					await channel.send({ embeds : [ embed ], files: [ file ] });
				}
				else{
					await channel.send({ embeds : [ embed ] });
				}
			}
		}
		else {
			flag = true;
		}
	});
});