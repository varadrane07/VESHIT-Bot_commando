/* eslint-disable no-undef */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const db = require('../../firebaseConnect');
const embed1 = new MessageEmbed()
    .setTitle('VESIT Bot')
    .setColor('#eba210')
    .setFooter('Show command in use');

module.exports = class RegisterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'show',
			aliases: ['open', 'certificates', 'certificate', 'certi', 'certis'],
			group: 'certis',
			memberName: 'show',
			// eslint-disable-next-line quotes
			description: `Registers your information to the Bot's Database`,
            argsType: 'single',
			throttling: {
				usages: 1,
				duration: 10,
			},
		});
	}
    async run(message) {
		const discordID = message.author.id;
		console.log(discordID);
		const user = await db.collection('Users').where('discordID', '==', `${discordID}`).get();
		if (!user.empty) {
				let Year = 2020;
				let emailID = '2018.name.surname@ves.ac.in';
				user.forEach(doc => {
					const userinfo = doc.data();
					console.log(userinfo);
					emailID = doc.id;
					Year = parseInt(userinfo.joinYear);

				});
                embed1.setDescription(`**Please Select the year of which you want to see your certificates.**\n
                **1️⃣ 1st Year**\nAcademic Year ${Year} - ${Year + 1}\n\n
                **2️⃣ 2nd Year**\nAcademic Year ${Year + 1} - ${Year + 2}\n\n
                **3️⃣ 3rd Year**\nAcademic Year ${Year + 2} - ${Year + 3}\n\n
                **4️⃣ 4th Year**\nAcademic Year ${Year + 3} - ${Year + 4}\n\n`);
			embed1.setFooter('Type 1 to 4 to select year');
			message.delete();
			console.log(emailID);
			message.embed(embed1).then (() => {
				const filter = m => message.author.id === m.author.id;

				message.channel.awaitMessages(filter, { maxProcessed: 1, time: 30000, errors: ['You Ran out of time. Type show again'] })
				.then(async messages1 => {
					console.log(messages1.first().content);
					const certiYear = parseInt(messages1.first().content) - 1 + Year;
					embed1.setDescription('Certificates are listed here');
					console.log(certiYear);
					const certiRef = db.collection('Users').doc(`${emailID}`).collection('Certificates');
					const snapshot = await certiRef.where('year', '==', certiYear).get();
					snapshot.forEach(doc => {
						const certi = doc.data();
						embed1.addFields(`${certi.name}`, `${doc.id}`);
					});
					if (certis.empty) {
						embed1.setDescription('You didnt receive any certificates');
						message.author.send(embed1);
					}
					message.author.send(embed1).then (() => {
						const filter2 = m => message.author.id === m.author.id;

						message.channel.awaitMessages(filter2, { maxProcessed: 1, time: 30000, errors: ['You Ran out of time. Type show again'] })
							.then(async messages => {
								console.log(messages.first().content);
								const reqCertino = parseInt(messages.first().content) - 1;
								const embed2 = new Discord.MessageEmbed()
									.setTitle(`${certificates[reqCertino].name}`)
									.setDescription(`[Certificate Link](${user.certificates[reqCertino].description})`)
									.setImage(certificates.link)
									.setFooter('Show command used.')
									.setColor('#ed9d09');
								messages.first().author.send(embed2);

							});
					});
				})
				.catch(() => {
					embed1.setDescription('There was an error, please try again');
				});
			});
		}
    }
};