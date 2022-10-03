import UClient, { IConfig } from './structs/UClient';
import minimist, { ParsedArgs } from 'minimist';
import { Partials } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import constants from './constants';
import run from './database';
import YAML from 'yaml';

const argv: ParsedArgs = minimist(process.argv.slice(2));

const client: UClient = new UClient({
    mobile: true,
    args: argv,
    intents: [
        'Guilds', 
        'GuildMessages',
        'GuildEmojisAndStickers',
        'GuildWebhooks',
        'GuildInvites',
        'GuildMembers',
        'GuildMessageReactions',
    ],
    partials: [ 
        Partials.Channel, 
        Partials.Message,
        Partials.Reaction 
    ]
});

const file: string = readFileSync(argv.path ? join(argv.path) : join(__dirname, '..', 'config.yaml'), 'utf-8');
const config: IConfig = YAML.parse(file);

constants.client = client;
constants.config = config;

run(`mongodb://${ config.database.host }:${ config.database.password }/unturned-info`);
client.start(config.discord.token);