import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import ItemModel, { IItem } from '../database/models/ItemModel';
import MapModel from '../database/models/MapModel';
import VehicleModel from '../database/models/VehicleModel';
import Command, { ExecuteFunction, ICommand } from '../structs/Command';

@Command
export default class TestCommand implements ICommand
{
    data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about an item or vehicle!')
        .addSubcommand(
            option =>
                option
                    .setName('vehicle')
                    .setDescription('The ID or name of a vehicle.')
                    .addStringOption(
                        option =>
                            option.setName('search')
                                .setDescription('The ID or name of a vehicle.')
                                .setRequired(true)
                    )
                    .addBooleanOption(
                        option =>
                            option.setName('id')
                                .setDescription('Search based from ID?')
                    )
        )
        .addSubcommand(
            option =>
                option
                    .setName('item')
                    .setDescription('The ID or name of an item')
                    .addStringOption(
                        option =>
                            option.setName('search')
                                .setDescription('The ID or name of an item.')
                                .setRequired(true)
                    )
                    .addBooleanOption(
                        option =>
                            option.setName('id')
                                .setDescription('Search based from ID?')
                    )
        )
        .addSubcommand(
            option =>
                option
                    .setName('map')
                    .setDescription('The name of a map.')
                    .addStringOption(
                        option =>
                            option.setName('search')
                                .setDescription('The name of a map..')
                                .setRequired(true)
                    )
                    .addBooleanOption(
                        option =>
                            option.setName('id')
                            .setDescription('Search based from ID?')
                    )
        );

    execute: ExecuteFunction = async (interaction: ChatInputCommandInteraction) =>
    {
        const name: string = interaction.options.getString('search', true);
        const id: boolean | null = interaction.options.getBoolean('ID');
        const subcommand: string = interaction.options.getSubcommand().toLowerCase();

        if(subcommand === 'vehicle')
        {
            const query = id ? await VehicleModel.findOne({ id: name }) : await VehicleModel.findOne({ name: name });

            if(!query)
                await interaction.reply({ content: 'Failed to find an item with that name or ID.' });

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(query!.name)
                    .setDescription(query!.description)
                    .setFooter({
                        text: 'Created by ' + query!.user.username + '#' + query?.user.discriminator,
                        iconURL: interaction.user.avatarURL() || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
                    })
                    .setThumbnail(query!.icon || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg')
                ]});

            return;
        }

        if(subcommand === 'item')
        {
            console.log(id);
            if(id)
                ItemModel.findOne({ id: name }, async (err: unknown, item: IItem) =>
                {
                    if(err)
                        return await interaction.reply({
                            content: 'Failed to search for item.'
                        });

                    console.log(item);

                    return await interaction.reply({
                        embeds: [new EmbedBuilder()
                            .setColor('Orange')
                            .setTitle(item!.name)
                            .setDescription(item!.description)
                            .setFooter({
                                text: 'Created by ' + item!.user.username + '#' + item?.user.discriminator,
                                iconURL: interaction.user.avatarURL() || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
                            })
                            .setThumbnail(item!.icon || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg')
                        ]
                    });
                });
            else
                ItemModel.findOne({ name: name }, async (err: unknown, item: IItem) =>
                {
                    if(err)
                        return await interaction.reply({
                            content: 'Failed to search for item.'
                        });

                    console.log(item);

                    return await interaction.reply({
                        embeds: [new EmbedBuilder()
                            .setColor('Orange')
                            .setTitle(item!.name)
                            .setDescription(item!.description)
                            .setFooter({
                                text: 'Created by ' + item!.user.username + '#' + item?.user.discriminator,
                                iconURL: interaction.user.avatarURL() || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
                            })
                            .setThumbnail(item!.icon || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg')
                        ]
                    });
                });

            return;
        }

        if(subcommand === 'map')
        {
            const query = await MapModel.findOne({ name: name });

            if(!query)
                await interaction.reply({ content: 'Failed to find an item with that name or ID.' });

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle(query!.name)
                    .setDescription(query!.description)
                    .setFooter({
                        text: 'Created by ' + query!.user.username + '#' + query?.user.discriminator,
                        iconURL: interaction.user.avatarURL() || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
                    })
                    .setThumbnail(query!.icon || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg')
                ]
            });


            return;
        }
    };
}