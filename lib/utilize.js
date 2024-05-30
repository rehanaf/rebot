module.exports = (bot, messages) => {
	const msg = messages;
	if (!msg.message) return;
	const [type] = Object.keys(msg.message);
	const text = type === "extendedTextMessage" ?
		msg.message.extendedTextMessage.text : type === "conversation" ?
			msg.message.conversation : "";
	const prefix = ".";
	const command = text.startsWith(prefix) ? text.substring(1).split(" ")[0].trim().toLowerCase() : '';
	const args = text.replace(/^(.*?)\s+\b/g, "");
	require("../events/message.js")(bot, msg, type, text, command, args);
}