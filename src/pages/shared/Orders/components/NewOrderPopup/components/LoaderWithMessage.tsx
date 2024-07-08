import React from 'react';
import { Typography, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

interface LoaderWithMessageProps {
    status: 'pending' | 'success' | 'error' | 'idle';
    message: string;
}

const LoaderWithMessage: React.FC<LoaderWithMessageProps> = ({ status, message }) => {
    const { t } = useTranslation();

    return (
        <Box mb={2} width="100%">
            {status === 'pending' && (
                <Box display="flex" alignItems="center">
                    <CircularProgress size={15} color="error" />
                    <Typography variant="body2" color="error.main" ml={1}>
                        {t(message)}
                    </Typography>
                </Box>
            )}
            {status === 'success' && (
                <Box display="flex" alignItems="center">
                    <DoneIcon color="success" />
                    <Typography variant="body2" color="success.main" ml={1}>
                        {t(message)}
                    </Typography>
                </Box>
            )}
            {status === 'error' && (
                <Box display="flex" alignItems="center">
                    <ErrorIcon color="error" />
                    <Typography variant="body2" color="error.main" ml={1}>
                        {t(message)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default LoaderWithMessage;
