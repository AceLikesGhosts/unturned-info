import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command, { ExecuteFunction, ICommand } from '../structs/Command';

@Command
export default class TestCommand implements ICommand
{
    data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test Command');

    execute: ExecuteFunction = (interaction: CommandInteraction) =>
    {
        interaction.reply({ content: 'test' });
    };
}