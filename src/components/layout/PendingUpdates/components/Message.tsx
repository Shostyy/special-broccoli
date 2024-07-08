import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/joy/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { BOTTOM_RIGHT_ERROR_MESSAGE_DURATION, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION } from '../../../../data/constants/constants';

interface MessageProps {
    isMessagesCollapsed: boolean;
    status: 'pending' | 'success' | 'error';
    message: string;
}

const Message: React.FC<MessageProps> = ({
    isMessagesCollapsed,
    status,
    message
}) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (status === 'success') {
            const interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress > 0 ? prevProgress - 1 : 0));
            }, BOTTOM_RIGHT_SUCCESS_MESSAGE_DURATION / 100);

            return () => {
                clearInterval(interval);
            };
        } else if (status === 'error') {
            const interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress > 0 ? prevProgress - 1 : 0));
            }, BOTTOM_RIGHT_ERROR_MESSAGE_DURATION / 100);

            return () => {
                clearInterval(interval);
            };
        }
    }, [status]);

    return (
        <div className={`bg-white p-2 flex mb-2 rounded-lg shadow-lg relative`}>
            {isMessagesCollapsed ? (
                <div className='bg-white p-1 flex items-center justify-center w-8 h-8'>
                    {status === 'pending' && (
                        <CircularProgress size={16} color="error" />
                    )}
                    {status === 'success' && (
                        <DoneIcon color="success" />
                    )}
                    {status === 'error' && (
                        <ErrorIcon color="error" />
                    )}
                </div>
            ) : (
                <div className='bg-white p-2 flex flex-grow items-center'>
                    {status === 'pending' && (
                        <div className="w-full">
                            <p className="text-sm mb-2">
                                {t(message)}
                            </p>
                            <LinearProgress color='danger' />
                        </div>
                    )}
                    {status === 'success' && (
                        <>
                            <LinearProgress
                                determinate
                                variant="solid"
                                value={progress}
                                color="success"
                                sx={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'gray' }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DoneIcon color="success" />
                                <p className="text-sm ml-2">{t(message)}</p>
                            </Box>
                        </>

                    )}
                    {status === 'error' && (
                        <>
                            <LinearProgress
                                determinate
                                variant="solid"
                                value={progress}
                                color="danger"
                                sx={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'gray' }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ErrorIcon color="error" />
                                <p className="text-sm ml-2">{t(message)}</p>
                            </Box>
                        </>

                    )}
                </div>
            )}
        </div>
    );
}

export default Message;
