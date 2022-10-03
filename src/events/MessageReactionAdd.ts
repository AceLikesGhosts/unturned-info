import Event, { DoubleExecuteFunction, IRawDoublEvent } from '../structs/Event';
import { EmbedBuilder, Events, MessageReaction, PartialUser, User } from 'discord.js';
import constants from 'src/constants';

@Event
export default class ReactionAddEevnt implements IRawDoublEvent<Events, MessageReaction, User | PartialUser>
{
    name: Events = Events.MessageReactionAdd;
    once: boolean = false;
    execute: DoubleExecuteFunction<MessageReaction, User | PartialUser> = async (client, e, user) =>
    {
        if(e.partial)
            try
            {
                await e.fetch();
            }
            catch(err)
            {
                console.error('Failed to fetch message : ' + e);
                return;
            }

        if(e.message.channel.id !== '826045539640148018')
            return;

        // Are messages we are looking for our by ourselfs (the bot account)
        // and contain an embed.
        if(!e.message.embeds || e.message.author?.id !== client.user?.id)
            return;

        // Loop over our IDs, if the user who added the reaction isnt in there 
        for(let i: number = 0; i < constants.config!.users.length; i++)
            if(user.id !== constants.config!.users[i])
                continue;

        if(e.emoji.name === '❌')
        {
            return await e.message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Submission denied. (❌)')
                        .setDescription(`
                        Title: ${ e.message.embeds[0].title }
                        Description:
                        ${ e.message.embeds[0].description }

                        Submitted by: ${ e.message.embeds[0].author }
                        `)
                ]
            });
        }

        await e.message.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Submission Accepted! (✅')
                    .setDescription(`
                    Title: ${ e.message.embeds[0].title }
                    Description:
                    ${ e.message.embeds[0].description }

                    Submitted by: ${ e.message.embeds[0].author }
                    `)
            ]
        });

        
    };
}