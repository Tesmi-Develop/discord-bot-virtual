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
        return this.#list.find((command) => command.name.toLowerCase() === name);
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

Command.add('хелп', 'Отображает все команды и описание к ним.', (client, message) => {
    let replyMessage = '> **Список всех команд**\n\n';
    Command.list.forEach((command) => {
        replyMessage += `> **${command.name}** - *${command.description}*\n`;
    });
    message.reply(replyMessage);
});

Command.add('идеи', 'Данная команда изменит текущий канал под канал для идей. (Удалит команду сразу, а свое сообщение полсе 10 секунд)', (client, message) => {
    const channelId = message.channelId;

    if (Bot.data.servers[message.guildId] === undefined) {
        Data.addServer(Bot.data, message.guildId);
    }

    Bot.data.servers[message.guildId].channelIdeas = channelId;
    
    message.reply('Канал изменён!').then((botMessage) => {
        setTimeout(() => {
            botMessage.delete();
        }, 10000);
    });

    message.delete();
});

Command.add('идея', 'Напишет идею в канал для идей. (Удаляет команду)', (client, message, ...strs) => {
    const idea = `> **Пользователь** ${message.author.username} **пердложил новую идею!**\n> ${strs.join(' ')}`;

    const server = Bot.data.servers[message.guildId];

    if (server === undefined) {
        message.reply('Ваш сервер не зарегестрирован!');
        return;
    }

    if (server?.channelIdeas === undefined) {
        message.reply('Вы не установили канал для идей.');
        return;
    }

    client.channels.cache.get(server.channelIdeas).send(idea).then((botMessage) => {
        botMessage.react('✅');
        botMessage.react('❌');
        message.delete();
    });
});
