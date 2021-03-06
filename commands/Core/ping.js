const { Command } = require('discord-akairo');

class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			category: 'Core',
			description: { content: 'Pings Katarina.' }
		});
	}

	async exec(message) {
		const sent = await message.util.reply('Pong!');
		const sentTime = sent.editedTimestamp || sent.createdTimestamp;
		const startTime = message.editedTimestamp || message.createdTimestamp;
		return message.util.reply(`Pong! (${sentTime - startTime} ms)`);
	}
}

module.exports = PingCommand;