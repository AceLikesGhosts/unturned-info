import { Client, ClientOptions, Guild, OAuth2Guild } from 'discord.js';
import { ParsedArgs } from 'minimist';
import { Collection } from '@discordjs/collection';
import { readdirSync, lstatSync } from 'fs';
import { ICommand } from './Command';
import { IEvent } from './Event';
import { join } from 'path';

interface IClientOpts extends ClientOptions
{
    mobile: boolean;
    args: ParsedArgs;
}

interface IConfig
{
    discord: {
        token: string,
    },
    database: {
        host: string,
        port: number,
        password: string;
    };
    users: String[];
}

class UClient extends Client
{
    public config?: IConfig;
    public commands: Collection<string, ICommand> = new Collection();
    public opts: IClientOpts;

    constructor(opts: IClientOpts)
    {
        super(opts.mobile ?
            {
                ...opts,
                ws: {
                    properties: {
                        'browser': 'Discord Android'
                    }
                }
            } :
            opts
        );

        this.opts = opts;
        this.importAll(join(__dirname, '..', 'commands'));
        this.importAll(join(__dirname, '..', 'events'));
    }

    private importAll(dir: string): void
    {
        const files: string[] = readdirSync(dir);

        for(let i: number = 0; i < files.length; i++)
        {
            const path: string = `${ dir }/${ files[i] }`;

            if(files[i].endsWith('.ts') || files[i].endsWith('.js'))
            {
                import(path);
            }
            else if(lstatSync(path).isDirectory())
            {
                this.importAll(dir);
            }
        }
    }

    public loadCommand(command: ICommand)
    {
        this.commands.set(command.data.name, command);
        console.log(`Registered command: ${ command.data.name }`);
    }

    public loadEvent(event: IEvent)
    {
        console.log(`Registered event: ${ event.name }`);

        if(event.once)
            this.once(event.name as string, (args) => event.execute(this, args));
        else
            this.on(event.name as string, (args) => event.execute(this, args));
    }

    /**
     * @description prolly dont work, dont know; here cause its a generic func to recursively get our commands but we use decorators now
     * @deprecated
     * @param collection 
     * @param directory 
     */
    public async loadCommands(collection: Collection<string, any>, directory: string)
    {
        const files: string[] = readdirSync(directory);

        for(let i: number = 0; i < files.length; i++)
        {
            const path: string = `${ directory }/${ files[i] }`;

            if(files[i].endsWith('.ts') || files[i].endsWith('.js'))
            {
                const command: any = await import(path);

                collection.set(command.name, command);
                console.log(`Registered command ${ command.name }`);
            }
            else if(lstatSync(path).isDirectory())
            {
                this.loadCommands(collection, path);
            }
        }
    }

    public start(token: string): Promise<UClient>
    {
        this.login(token)
            .then(() =>
            {
                if(this.opts.args.deploy)
                {
                    this.redeployCommands();
                    console.log('Redeploying slash commands..');
                }
            });

        return new Promise<UClient>((res) => res(this));
    }

    public redeployCommands(): Promise<boolean>
    {
        return new Promise<boolean>(async (res) =>
        {
            const allGuilds: Collection<string, OAuth2Guild> = await this.guilds.fetch();

            for(let i: number = 0; i < allGuilds.size; i++)
            {
                const guild: OAuth2Guild | undefined = allGuilds.at(i);

                if(!guild)
                    continue;

                const fetched: Guild = await guild.fetch();
                fetched.commands.set(this.commands.map(command => command.data.toJSON()));
            }

            res(true);
        });
    }
}

export default UClient;

export type {
    IClientOpts,
    IConfig
};