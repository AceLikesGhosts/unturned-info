import { connect } from 'mongoose';

async function run(uri: string): Promise<any>
{
    const connection = await connect(uri);

    return new Promise<any>((r) => r(connection));
}

export default run;