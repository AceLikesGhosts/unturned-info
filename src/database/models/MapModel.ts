import { User } from 'discord.js';
import { Schema, model } from 'mongoose';

interface IMap
{
    icon: string,
    name: string,
    description: string;
    user: User
}

const mapSchema = new Schema<IMap>({
    icon: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.Mixed, required: true }
});

export default model<IMap>('Map', mapSchema);
export
{
    IMap
};