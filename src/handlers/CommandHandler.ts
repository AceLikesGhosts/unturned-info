import { ChatInputCommandInteraction } from 'discord.js';
import { ICommand } from '../structs/Command';
import UClient from '../structs/UClient';

export default async function handleCommand(client: UClient, interaction: ChatInputCommandInteraction): Promise<void>
{
    const command: ICommand | undefined = client.commands.get(interaction.commandName);

    if(!command)
        return;

    try
    {
        await command.execute(interaction);
    }
    catch(error: unknown)
    {
        console.log(error);
        await interaction.channel?.send(`An error occured while trying to run that command.\nError: ${error}`);
    }
}