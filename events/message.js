module.exports = async(bot, msg, type, text, command, args) => {
	const firstWord = text.split(' ')[0];
	const nextWord = text.substr(text.indexOf(" ") + 1);
	const id = msg.key.id;
	const from = msg.key.remoteJid;
	const isGroup = from.endsWith('@g.us');
	const sender = isGroup ? msg.key.participant : from;
	const pushName = msg.pushName;
	const metadata = isGroup ? await bot.groupMetadata(from) : '';
	const reply = async(text, options = {}) => {
		return bot.sendMessage(from, { text: text },{ quoted: msg });
	}
	console.log(`${isGroup ? metadata.subject + ` > ` : ''}${pushName}: ${text}`);

	switch (command) {
		case 'ping':
			reply('pong');
			break;
	}

	switch (firstWord.toLowerCase()) {
		case 'bot':
			reply(`Hii ${pushName}`);
	}
	
	
};