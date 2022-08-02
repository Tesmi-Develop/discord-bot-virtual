import config from './config.js';
import fs from 'fs';

export default class Data {
    static create() {
        return {
            servers: {}
        };
    }

    static addServer(data, serverId) {
        data.servers[serverId] = {
            channelIdeas: undefined
        }
    }

    /**
     * @param {object} data
     */
    static save(data) {
        const json = JSON.stringify(data);

        fs.writeFileSync(config.pathData, json);
    }

    static load() {
        if (!fs.existsSync(config.pathData)) return this.create();

        return JSON.parse(fs.readFileSync(config.pathData));
    }
}
