import { AxiosResponse } from 'axios';
import { fetchClientFullResponse } from '../fetchClientFullResponse';
import { RESPONSE_STATUS_OK, TIMEOUT_NO_DELAY } from '../../data/constants/constants';

interface SubscribeOptions {
    eventSourceUrl: string;
    initializeUpdateUrl: string;
    initializeUpdateIds: Set<number>;
}

export const subscribeForUpdateAll = ({
    eventSourceUrl,
    initializeUpdateUrl,
    initializeUpdateIds,
}: SubscribeOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
        const eventSource = new EventSource(eventSourceUrl, { withCredentials: true });
        let updateCount = 0;
        const updatesRequired = initializeUpdateIds.size;

        const handleUpdate = () => {
            updateCount += 1;
            if (updateCount === updatesRequired) {
                eventSource.close();
                resolve();
            }
        };

        eventSource.addEventListener('update', handleUpdate);

        const initializeUpdates = () => {
            const idsToInitialize = Array.from(initializeUpdateIds);
            let index = 0;

            const intervalId = setInterval(() => {
                if (index < idsToInitialize.length) {
                    const id = idsToInitialize[index++];
                    fetchClientFullResponse.post(`${initializeUpdateUrl}/${id}`)
                        .then((res: AxiosResponse) => {
                            if (res.status !== RESPONSE_STATUS_OK) {
                                throw new Error(`Initialization failed for ID ${id}`);
                            }
                        })
                        .catch(error => {
                            handleError(eventSource, reject, error.message);
                        });
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
        };

        setTimeout(initializeUpdates, TIMEOUT_NO_DELAY);
    });
};

const handleError = (eventSource: EventSource, reject: (error: Error) => void, message: string) => {
    eventSource.close();
    reject(new Error(message));
};
