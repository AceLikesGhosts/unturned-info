import UClient from '../structs/UClient';
import Event, { ExecuteFunction, IRawEvent } from '../structs/Event';
import { Events } from 'discord.js';

@Event
export default class ReadyEvent implements IRawEvent<Events, UClient>
{
    name: Events = Events.ClientReady;
    once: boolean = true;
    execute: ExecuteFunction<UClient> = (e) =>
    {
        console.log('Logged in on account %s, at %s.', e.user?.username, new Date().toDateString());
    };
}
export function Seed() { console.log('seed'); }