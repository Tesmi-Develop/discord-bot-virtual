import Data from './data.js';
import Bot from './main.js';

export class Command {
    static #list = [];
    static get list() {
        return this.#list;
    };

    /**
     * @param {string} name
     * @param {string} description
     * @param {function} callback
     */
    constructor(name, description, callback) {
        this.name = name;
        this.description = description;
        this.callback = callback;
    }

    /**
     * @param {Command} command
     */
    static #addInArray(command) {
        this.#list.push(command);
    }

    /**
     * @param {string} name
     */
    static find(name) {
        return this.#list.find((command) => command.name === name);
    }

    /**
     * @param {string} name
     * @param {Client} client
     * @param {Message} message
     * @param {...string} args
     */
    static execute(name, client, message, data, ...args) {
        const command = this.find(name);

        if (command === undefined) return;

        command.callback(client, message, data, ...args);
    }

    /**
     * @param {string} name
     * @param {string} description
     * @param {function} callback
     */
    static add(name, description, callback) {
        this.#addInArray(new this(name, description, callback));
    }
}

Command.add('привет', 'данная команда заставит бота написать "Привет"', (client, message) => {
    message.reply('Привет');
});

Command.add('напиши', 'gg', (client, message, ...args) => {
    if (args.length == 0) return;

    message.reply(args.join(' '));
});

Command.add('изменитьКаналИдейНаТекущий', 'данная команда изменит текущий канал под канал для идей', (client, message) => {
    const channelId = message.channelId;

    if (Bot.data.servers[message.guildId] === undefined) {
        Data.addServer(Bot.data, message.guildId);
    }

    Bot.data.servers[message.guildId] = {};
});
