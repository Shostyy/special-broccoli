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

export const subscribeForUpdates = ({
    eventSourceUrl,
    initializeUpdateUrl,
    dispatch,
    updateAction,
    fulfilledAction,
    rejectedAction,
    resetAction,
    successDuration,
    errorDuration,
}: SubscribeOptions) => {
    const eventSource = new EventSource(eventSourceUrl, { withCredentials: true });

    setTimeout(() => {
        fetchClientFullResponse.post(initializeUpdateUrl)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(updateAction());

                    eventSource.addEventListener('update', () => {
                        dispatch(fulfilledAction());
            
                        setTimeout(() => {
                            dispatch(resetAction());
                        }, successDuration);
            
                        eventSource.removeEventListener('update', () => {})
                        eventSource.close();
                    });
            
            
                    eventSource.onerror = (e: Event) => {
                        dispatch(rejectedAction());
                        eventSource.close();
            
                        setTimeout(() => {
                            dispatch(resetAction());
                        }, errorDuration);
                    };
                }
            })
            .catch(() => {
                dispatch(rejectedAction());
                eventSource.close();

                setTimeout(() => {
                    dispatch(resetAction());
                }, successDuration);
            });
    }, 0);
};
