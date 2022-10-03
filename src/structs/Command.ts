import { SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import constants from '../constants';

interface ICommand
{
    data: SlashCommandSubcommandsOnlyBuilder,
    execute: ExecuteFunction;
}

/**
 * @description Decorator for our commands.
 * @param {any} target The object class object. 
 */
function Command(target: any)
{
    const targetClass = new target();

    const data = targetClass.data;
    const execute = targetClass.execute;

    constants.client?.loadCommand({
        data,
        execute
    });
}

export default Command;
export type ExecuteFunction = (interaction: ChatInputCommandInteraction) => any;
export type {
    ICommand
};