import { ClientEvents } from 'discord.js';
import constants from '../constants';
import UClient from './UClient';

interface IRawEvent<N, E>
{
    name: N,
    once: boolean,
    execute: ExecuteFunction<E>;
}

interface IRawDoublEvent<N, E, EN>
{
    name: N,
    once: boolean,
    execute: DoubleExecuteFunction<E, EN>;
}

/**
 * @description Decorator for our commands.
 * @param {any} target The object class object. 
 */
function Event(target: any)
{
    const targetClass = new target();

    const name = targetClass.name;
    const once = targetClass.once;
    const execute = targetClass.execute;

    constants.client?.loadEvent({
        name,
        once,
        execute
    });
}

export default Event;
export type ExecuteFunction<T> = (client: UClient, event: T) => any;
export type DoubleExecuteFunction<T, E> = (client: UClient, event: T, other: E) => any;
export type IEvent = IRawEvent<keyof ClientEvents, any>;
export type {
    IRawEvent,
    IRawDoublEvent
};