import { PostServerConfig } from '../../../../api/types/postServerConfig';

export const prepareOneLineConfig = (config: PostServerConfig): string => {
    return `#${config.id}. ${config.email}; ${config.host}; ${config.password}; ${config.port}; ${config.useSSL ? 'true' : 'false'}`;
};