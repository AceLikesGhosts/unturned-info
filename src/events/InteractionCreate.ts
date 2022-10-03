import Event, { ExecuteFunction, IRawEvent } from '../structs/Event';
import { CacheType, Events, Interaction } from 'discord.js';
import handleCommand from '../handlers/CommandHandler';

@Event
export default class InteractionCreateEvent implements IRawEvent<Events, Interaction<CacheType>>
{
    name: Events = Events.InteractionCreate;
    once: boolean = false;
    execute: ExecuteFunction<Interaction<CacheType>> = (client, e) =>
    {
        if(e.isChatInputCommand()) handleCommand(client, e);
    };
}