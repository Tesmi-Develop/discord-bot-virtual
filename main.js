import process from 'node:process';
import { Client, GatewayIntentBits } from 'discord.js';
import { Command } from './command.js';
import config from './config.js';
import Data from './data.js';

export default class Bot {
  static debug = true;
  static client = new Client({
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages, 
      GatewayIntentBits.GuildMessageReactions, 
      GatewayIntentBits.MessageContent
    ]
  });

  static data = Data.load();

  static init() {
    process.on('SIGINT', () => {
      console.log("Caught interrupt signal");
    
      process.exit();
    });
    
    process.on('exit', (code) => {
      Data.save(this.data);
    });

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    
    this.client.on('messageCreate', (message) => {
      const content = message.content;
      const prefix = config.default.prefix;
    
      if (!content.startsWith(prefix)) return;
      
      const args = content.split(' ');
      const name = args[0].substring(prefix.length).toLowerCase();
    
      console.log(`Get new command: ${name}`);
      Command.execute(name, this.client, message, ...args.slice(1))
    });
    
    this.client.login(config.token);
    console.log('Login successful');
  }
}

Bot.init();
