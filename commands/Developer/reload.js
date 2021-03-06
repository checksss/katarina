const { Command } = require("discord-akairo");
const Logger = require("../../util/Logger");

class ReloadCommand extends Command {
  constructor() {
    super("reload", {
      aliases: ["reload", "r"],
      category: "owner",
      ownerOnly: true,
      description: {
        content: "Reloads a module.",
        usage: "<module> [type:]"
      }
    });
  }

  *args() {
    const type = yield {
      match: "option",
      flag: ["type:"],
      type: [["command", "c"], ["inhibitor", "i"], ["listener", "l"]],
      default: "command"
    };

    const silent = yield {
      match: "flag",
      flag: "--silent"
    };

    const mod = yield {
      type: (msg, phrase) => {
        if (!phrase) return null;
        const resolver = this.handler.resolver.type(
          {
            command: "commandAlias",
            inhibitor: "inhibitor",
            listener: "listener"
          }[type]
        );

        return resolver(msg, phrase);
      }
    };

    return { type, mod, silent };
  }

  exec(message, { type, mod, silent }) {
    if (!mod) {
      this.client.commandHandler.reloadAll();
      return message.util.reply(`Reload all commands.`);
    }

    try {
      mod.reload();
      return message.util.reply(`Sucessfully reloaded ${type} \`${mod.id}\`.`);
    } catch (err) {
      Logger.error(`Error occured reloading ${type} ${mod.id}`);
      Logger.stacktrace(err);
      return message.util.reply(`Failed to reload ${type} \`${mod.id}\`.`);
    }
  }
}

module.exports = ReloadCommand;
