import UClient, { IConfig } from './structs/UClient';

interface IConstants
{
    client: UClient | null,
    database: any | null,
    config: IConfig | null
}

const constants: IConstants = {
    client: null,
    database: null,
    config: null
};

export default constants;