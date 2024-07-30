import { AxiosResponse } from 'axios';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { RESPONSE_STATUS_OK, TIMEOUT_NO_DELAY } from '../../data/constants/constants';

type ActionFunction = () => void;

interface SubscribeOptions {
    eventSourceUrl: string;
    initializeUpdateUrl: string;
    dispatch: (action: any) => void;
    updateAction: ActionFunction;
    fulfilledAction: ActionFunction;
    rejectedAction: ActionFunction;
    resetAction: ActionFunction;
    updateDataAction?: ActionFunction;
    successDuration: number;
    errorDuration: number;
    requestBody?: any;
}

export const subscribeForUpdates = (options: SubscribeOptions) => {
    const eventSource = new EventSource(
        options.eventSourceUrl,
        { withCredentials: true },
    );

    setTimeout(() => initializeUpdate(options, eventSource), TIMEOUT_NO_DELAY);
};

const initializeUpdate = (
    options: SubscribeOptions,
    eventSource: EventSource,
) => {
    fetchClientFullResponse.post(options.initializeUpdateUrl, options.requestBody, 'application/json')
        .then(res => handleInitializeSuccess(res, options, eventSource))
        .catch(() => handleInitializeError(options, eventSource));
};

const handleInitializeSuccess = (
    res: AxiosResponse,
    options: SubscribeOptions,
    eventSource: EventSource,
) => {
    if (res.status !== RESPONSE_STATUS_OK) return;

    options.dispatch(options.updateAction());
    setupEventListeners(options, eventSource);
};

const handleInitializeError = (
    options: SubscribeOptions,
    eventSource: EventSource,
) => {
    options.dispatch(options.rejectedAction());
    eventSource.close();
    scheduleReset(options, options.successDuration);
};

const setupEventListeners = (
    options: SubscribeOptions,
    eventSource: EventSource,
) => {
    eventSource.addEventListener('update', () => handleUpdate(options, eventSource));
    eventSource.onerror = () => handleError(options, eventSource);
};

const handleUpdate = (options: SubscribeOptions, eventSource: EventSource) => {
    options.dispatch(options.fulfilledAction());
    if (options.updateDataAction) {
        options.dispatch(options.updateDataAction())
    }
    scheduleReset(options, options.successDuration);
    eventSource.removeEventListener('update', () => handleUpdate);
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