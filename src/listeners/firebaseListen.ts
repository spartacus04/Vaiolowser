import { getApp } from '../config/firebase';
import { collection, getFirestore, onSnapshot, deleteDoc, doc, Unsubscribe } from 'firebase/firestore';
import { AttachmentBuilder, EmbedBuilder, TextChannel } from 'discord.js';
import { client, Listener } from '../config';

let unsub: Unsubscribe;

const firebaseListener : Listener = {
	deferred: true,

	register() {
		const app = getApp();
		const firestore = getFirestore(app);

		const col = collection(firestore, 'Vaiolowser-Ngrok-Ips');

		let flag = false;

		unsub = onSnapshot(col, async snapshot => {
			const channel = (await client.channels.fetch('821676557465681920')) as TextChannel;
			if(flag) {
				snapshot.docChanges().forEach(async obj => {
					if(obj.type == 'added' && channel) {
						await channel.sendTyping();
						const data = obj.doc.data();
						const embed = new EmbedBuilder()
							.setAuthor({ name: 'Nuovo indirizzo IP' })
							.setColor('#00FF17')
							.setTitle(data.game)
							.setFooter({ text: `Inviato alle ${new Date().getHours()}:${new Date().getMinutes()}` })
							.setDescription(data.separateIp ? `Ip : ${data.ip}\nPorta : ${data.port}` : `${data.ip}:${data.port}`);
						if(data.image) {
							const file = new AttachmentBuilder(
								Buffer.from(data.image, 'base64'), {
									name: 'serverImage.png',
								}
							);

							embed.setThumbnail('attachment://serverImage.png');
							await channel.send({ embeds : [ embed ], files: [ file ] });
						}
						else{
							await channel.send({ embeds : [ embed ] });
						}

						await deleteDoc(doc(firestore, 'Vaiolowser-Ngrok-Ips', obj.doc.id));
						obj.doc.data().remove;
					}
				});
			}
			else {
				flag = true;
			}
		});
	},

	unregister() {
		unsub();
	},
};

module.exports = firebaseListener;