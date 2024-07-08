import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { appIcons } from '../../../../data/constants/icons';
import { Box, CircularProgress } from '@mui/material';

// Define props interface
interface UpdateButtonProps {
    onClick: () => void; // Function to handle button click
    disabled?: boolean; // Optional flag to disable button
    updateStatus: 'idle' | 'pending' | 'error' | 'success'; // Update status can only be 'idle' or 'pending'
}

// Define styled button component with styled-components
const StyledButton = styled.button<{ disabled?: boolean }>`
    height: 50px;
    width: 125px;
    background-color: #fff;
    border: 1px solid #c25458;
    color: #c25458;
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 4px;
    border-radius: 5px;
    cursor: pointer; // Ensure pointer cursor to indicate clickable
    outline: none; // Remove default outline on focus
    &:hover {
        background-color: #f9eeef;
    }
    ${(props) => props.disabled && `
        opacity: 0.6;
        cursor: not-allowed;
    `}
`;

const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick, disabled = false, updateStatus }) => {
    const { t } = useTranslation();
    const handleUpdate = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <StyledButton
            onClick={handleUpdate}
            disabled={disabled || updateStatus === 'pending'}
        >
            {updateStatus === 'pending' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={24} color="inherit" />
                </Box>
            ) : (
                <>
                    <img src={appIcons.reloadRed} alt="reload icon" />
                    {t('Upd')}
                </>
            )}
        </StyledButton>
    );
};

export default UpdateButton;
