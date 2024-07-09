import { AxiosResponse } from 'axios';
import { fetchClientFullResponse } from '../fetchClientFullResponse';

type ActionFunction = () => void;

interface SubscribeOptions {
    eventSourceUrl: string;
    initializeUpdateUrl: string;
    dispatch: (action: any) => void;
    updateAction: ActionFunction;
    fulfilledAction: ActionFunction;
    rejectedAction: ActionFunction;
    resetAction: ActionFunction;
    successDuration: number;
    errorDuration: number;
}

export const subscribeForUpdates = (options: SubscribeOptions) => {
    const eventSource = new EventSource(options.eventSourceUrl, { withCredentials: true });

    setTimeout(() => initializeUpdate(options, eventSource), 0);
};

const initializeUpdate = (options: SubscribeOptions, eventSource: EventSource) => {
    fetchClientFullResponse.post(options.initializeUpdateUrl)
        .then(res => handleInitializeSuccess(res, options, eventSource))
        .catch(() => handleInitializeError(options, eventSource));
};

const handleInitializeSuccess = (res: AxiosResponse, options: SubscribeOptions, eventSource: EventSource) => {
    if (res.status !== 200) return;

    options.dispatch(options.updateAction());
    setupEventListeners(options, eventSource);
};

const handleInitializeError = (options: SubscribeOptions, eventSource: EventSource) => {
    options.dispatch(options.rejectedAction());
    eventSource.close();
    scheduleReset(options, options.successDuration);
};

const setupEventListeners = (options: SubscribeOptions, eventSource: EventSource) => {
    eventSource.addEventListener('update', () => handleUpdate(options, eventSource));
    eventSource.onerror = () => handleError(options, eventSource);
};

const handleUpdate = (options: SubscribeOptions, eventSource: EventSource) => {
    options.dispatch(options.fulfilledAction());
    scheduleReset(options, options.successDuration);
    eventSource.removeEventListener('update', () => {});
    eventSource.close();
};

const handleError = (options: SubscribeOptions, eventSource: EventSource) => {
    options.dispatch(options.rejectedAction());
    eventSource.close();
    scheduleReset(options, options.errorDuration);
};

const scheduleReset = (options: SubscribeOptions, duration: number) => {
    setTimeout(() => options.dispatch(options.resetAction()), duration);
};