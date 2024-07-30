import { SxProps, Theme } from '@mui/material';

export const modalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    outline: 'none',
    border: 'none',
};

export const titleStyle: SxProps<Theme> = {
    color: '#C1585C'
};

export const descriptionStyle: SxProps<Theme> = {
    mt: 2,
    color: '#C1585C'
};

export const progressBarStyle: SxProps<Theme> = {
    mt: 2,
    bgcolor: '#C1585C',
    '& .MuiLinearProgress-bar': {
        bgcolor: '#FF5733',
    },
};