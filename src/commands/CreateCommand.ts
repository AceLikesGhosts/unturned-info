import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import Command, { ExecuteFunction, ICommand } from '../structs/Command';
import Item from '../database/models/SharedModel';
import Map from '../database/models/MapModel';

function isValidHttpUrl(uri: string): boolean
{
    let url;

    try
    {
        url = new URL(uri);
    } catch(_)
    {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

@Command
export default class TestCommand implements ICommand
{
    data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
        .setName('create')
        .setDescription('Add an item to our database!')
        .addSubcommand(
            option =>
                option
                    .setName('item')
                    .setDescription('Create a new item.')
        )
        .addSubcommand(
            option =>
                option
                    .setName('map')
                    .setDescription('Create a new map.')
        );

    execute: ExecuteFunction = async (interaction: ChatInputCommandInteraction) =>
    {
        const subcommand: string = interaction.options.getSubcommand().toLowerCase();

        await interaction.reply('Creating new entry, please answer these questions.');

        const name: string = await createListener(interaction, 'What is the name of the ' + subcommand + '?');
        let id: number | undefined;

        if(!(subcommand === 'map'))
            id = parseInt(await createListener(interaction, 'What is the ID of the ' + subcommand + '?'));

        const description: string = await createListener(interaction, 'Provide a small description of the ' + subcommand + '.');
        let icon: string = await createListener(interaction, 'Provide an icon URL for the ' + subcommand + '.');

        if(id === NaN)
        {
            interaction.channel?.send('ID is not valid, canceling.');
            return;
        }

        if(!isValidHttpUrl(icon))
            icon = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';

        switch(subcommand)
        {
            case 'item':
                {
                    const item = new Item({
                        name: name,
                        description: description,
                        id: id,
                        icon: icon,
                        user: interaction.user
                    });

                    item.save();
                    await interaction.channel?.send({
                        embeds: [new EmbedBuilder()
                            .setColor('Orange')
                            .setTitle(name)
                            .setDescription(`
                            ID: ${ id }

                            ${ description }
                            `)
                            .setFooter({
                                text: 'Created by ' + interaction.user.username + '#' + interaction.user.discriminator,
                                iconURL: interaction.user.avatarURL() || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
                            })
                            .setThumbnail(icon || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg')
                        ]
                    });

                    break;
                }
            case 'map':
                {
                    const map = new Map({
                        name: name,
                        description: description,
                        icon: icon,
                        user: interaction.user
                    });

                    map.save();
                    await interaction.channel?.send({
                        embeds: [new EmbedBuilder()
                            .setColor('Green')
                            .setTitle(name)
                            .setDescription(description)
                            .setFooter({
                                text: 'Created by ' + interaction.user.username + '#' + interaction.user.discriminator,
                                iconURL: interaction.user.avatarURL() || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
                            })
                            .setThumbnail(icon || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg')
                        ]
                    });

                    break;
                }
            default:
                {
                    throw new Error('Bad data.');
                }
        }
    };
}

async function createListener(interaction: ChatInputCommandInteraction, query: string): Promise<string>
{
    return new Promise<string>(async (resolve) =>
    {
        await interaction.channel!.send(query);
        const filter = (m: any) => m.author.id === interaction.user.id;
        await interaction.channel?.awaitMessages({ filter, max: 1, time: 15_000, errors: ['time'] })
            .then(async (col) => 
            {
                resolve((await col.first()?.fetch())!.content);
            })
            .catch(() => interaction.followUp('Ran out of time.'));
    });
}