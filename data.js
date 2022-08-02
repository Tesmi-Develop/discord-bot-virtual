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
		fs.writeFileSync(config.pathData, JSON.stringify(data));
		console.log('Save data successful.')
	}

	static load() {
		console.log('Load data successful.')
		if (!fs.existsSync(config.pathData)) return this.create();
		return JSON.parse(fs.readFileSync(config.pathData));
	}
}
