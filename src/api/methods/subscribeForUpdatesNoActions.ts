import { AxiosResponse } from 'axios';
import { fetchClientFullResponse } from '../fetchClientFullResponse';

interface SubscribeOptions {
    eventSourceUrl: string;
    initializeUpdateUrl: string;
}

export const subscribeForUpdatesNoActions = ({
    eventSourceUrl,
    initializeUpdateUrl,
}: SubscribeOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
        const eventSource = new EventSource(eventSourceUrl, { withCredentials: true });
        setTimeout(() => initializeUpdate(initializeUpdateUrl, eventSource, resolve, reject), 0);
    });
};

const initializeUpdate = (
    initializeUpdateUrl: string,
    eventSource: EventSource,
    resolve: () => void,
    reject: (error: Error) => void
) => {
    fetchClientFullResponse.post(initializeUpdateUrl)
        .then(res => handleInitializeSuccess(res, eventSource, resolve, reject))
        .catch(() => handleError(eventSource, reject, 'Event source error'));
};

const handleInitializeSuccess = (
    res: AxiosResponse,
    eventSource: EventSource,
    resolve: () => void,
    reject: (error: Error) => void
) => {
    if (res.status !== 200) {
        handleError(eventSource, reject, 'Initialization failed');
        return;
    }

    setupEventListeners(eventSource, resolve, reject);
};

const setupEventListeners = (
    eventSource: EventSource,
    resolve: () => void,
    reject: (error: Error) => void
) => {
    eventSource.addEventListener('update', () => handleUpdate(eventSource, resolve));
    eventSource.onerror = () => handleError(eventSource, reject, 'Event source error');
};

const handleUpdate = (eventSource: EventSource, resolve: () => void) => {
    resolve();
    eventSource.removeEventListener('update', () => {});
    eventSource.close();
};

const handleError = (eventSource: EventSource, reject: (error: Error) => void, message: string) => {
    reject(new Error(message));
    eventSource.close();
};