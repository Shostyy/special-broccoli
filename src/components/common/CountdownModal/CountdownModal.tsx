import React, { useEffect, useState } from 'react';
import GeneralButton from '../Buttons/GeneralButton/GeneralButton';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    Box,
    Typography,
    LinearProgress,
} from '@mui/material';
import {
    modalStyle,
    titleStyle,
    descriptionStyle,
    progressBarStyle,
} from './styles/CountdownModal.styles';
import {
    COUNTDOWN_END,
    COUNTDOWN_STEP,
    HUNDRED_PERCENT,
    ONE_SECOND_IN_MS,
    RETRY_INTERVAL_SEC,
} from '../../../data/constants/constants';

interface CountdownModalProps {
    onReload: () => void;
}

const CountdownModal: React.FC<CountdownModalProps> = ({ onReload }) => {
    const [countdown, setCountdown] = useState(RETRY_INTERVAL_SEC);
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === COUNTDOWN_END) {
                    clearInterval(timer);
                    onReload();
                    return 0;
                }
                return prev - COUNTDOWN_STEP;
            });
        }, ONE_SECOND_IN_MS);

        return () => clearInterval(timer);
    }, [onReload]);

    return (
        <Modal
            open={true}
            onClose={onReload}
            aria-labelledby="countdown-modal-title"
            aria-describedby="countdown-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography
                    id="countdown-modal-title"
                    variant="h6"
                    component="h2"
                    sx={titleStyle}
                >
                    {t('UnableToConnect')}
                </Typography>
                <Typography
                    id="countdown-modal-description"
                    sx={descriptionStyle}
                >
                    {t('RetryAfter')} {countdown} {t('Seconds')}...
                </Typography>
                <div className="flex justify-center mt-5 mb-2">
                    <GeneralButton
                        onClick={onReload}
                        translationKey="RetryNow"
                    />
                </div>
                <LinearProgress
                    variant="determinate"
                    value={(countdown / RETRY_INTERVAL_SEC) * HUNDRED_PERCENT}
                    sx={progressBarStyle}
                />
            </Box>
        </Modal>
    );
};

export default CountdownModal;