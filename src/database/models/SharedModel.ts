import { User } from 'discord.js';
import { Schema, model } from 'mongoose';

interface IItem
{
    icon: string,
    name: string,
    description: string;
    id: number;
    user: User;
}

const itemSchema = new Schema<IItem>({
    icon: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    id: { type: Number, required: true },
    user: { type: Schema.Types.Mixed, required: true }
});

export default model<IItem>('Item', itemSchema);
export
{
    IItem
};