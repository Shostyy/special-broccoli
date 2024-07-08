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

        setTimeout(() => {
            fetchClientFullResponse.post(initializeUpdateUrl)
                .then((res) => {
                    if (res.status === 200) {
                        eventSource.addEventListener('update', () => {
                            resolve();
                            eventSource.removeEventListener('update', () => {});
                            eventSource.close();
                        });

                        eventSource.onerror = (e: Event) => {
                            reject(new Error('ES err'));
                            eventSource.close();
                        };
                    } else {
                        reject(new Error('Initialization failed'));
                        eventSource.close();
                    }
                })
                .catch(() => {
                    reject(new Error('ES err'));
                    eventSource.close();
                });
        }, 100);
    });
};