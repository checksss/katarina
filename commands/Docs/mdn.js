const { Command } = require("discord-akairo")
const fetch = require('node-fetch');
const qs = require('querystring');
const Turndown = require('turndown');

module.exports = class MDNCommand extends Command {
	constructor() {
		super('mdn', {
			aliases: ['mdn', 'mozilla-developer-network'],
			category: 'Docs',
			description: {
				content: "Searches MDN for your query",
				usage: '<query>',
				examples: ['Map', 'Map#get', 'Map.set'],
			},
			regex: /^(?:mdn,) (.+)/i,
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					id: 'query',
					prompt: {
						start: (message) => `what would you like to search for?`,
					},
					match: 'content',
					type: (_, query) => query.replace(/#/g, '.prototype.'),
				},
			],
		});
	}
  async exec(message, { query, match}) {
    if (!query && match) query = match[1];
		const queryString = qs.stringify({ q: query });
		const res = await fetch(`https://mdn.pleb.xyz/search?${queryString}`);
		const body = await res.json();
		if (!body.URL || !body.Title || !body.Summary) {
			return message.util.reply("Katarina couldn't find the requested information. Maybe look for something that actually exists the next time!");
		}
		const turndown = new Turndown();
		turndown.addRule('hyperlink', {
			filter: 'a',
			replacement: (text, node) => `[${text}](https://developer.mozilla.org${(node = HTMLLinkElement).href})`,
		});
		const summary = body.Summary.replace(/<code><strong>(.+)<\/strong><\/code>/g, '<strong><code>$1</code></strong>');
		const embed = this.client.util.embed()
			.setColor(0x066fad)
			.setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
			.setURL(`https://developer.mozilla.org${body.URL}`)
			.setTitle(body.Title)
			.setDescription(turndown.turndown(summary));

		return message.util.send(embed);
  }
}