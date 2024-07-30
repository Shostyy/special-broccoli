import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

interface StyledButtonProps {
    disabled?: boolean;
    size?: 'default' | 'short' | 'full';
    width?: number | string;
    variant?: 'filled' | 'outlined';
}

const StyledButton = styled.button<StyledButtonProps>`
    height: ${props => {
        switch (props.size) {
            case 'short': return '40px';
            case 'full': return '48px';
            default: return '50px';
        }
    }};
    width: ${props => {
        switch (props.size) {
            case 'short': return '100px';
            case 'full': return '100%';
            default: return `${props.width || 210}px`;
        }
    }};
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 4px;
    border-radius: 0.375rem;
    cursor: pointer;
    outline: none;
    padding-inline: 5px;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s;

    ${props => props.variant === 'filled' ? css`
        background-color: #c1585c;
        border: none;
        color: #fff;
        &:hover {
            background-color: #a94c50;
        }
        &:focus {
            box-shadow: 0 0 0 3px rgba(193, 88, 92, 0.5);
        }
    ` : css`
        background-color: #fff;
        border: 1px solid #c1585c;
        color: #c1585c;
        &:hover {
            background-color: #f9eeef;
        }
        &:focus {
            box-shadow: 0 0 0 3px rgba(193, 88, 92, 0.3);
        }
    `}

    ${(props) => props.disabled && css`
        opacity: 0.6;
        cursor: not-allowed;
        &:hover {
            background-color: ${props.variant === 'filled' ? '#c1585c' : '#fff'};
        }
    `}
`;

interface GeneralButtonProps extends StyledButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    icon?: string;
    translationKey: string;
}

const GeneralButton: React.FC<GeneralButtonProps> = ({
    onClick,
    type,
    disabled = false,
    icon,
    size = 'default',
    translationKey,
    width,
    variant = 'outlined'
}) => {
    const { t } = useTranslation();

    const handleButtonClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };


    return (
        <StyledButton
            type={type}
            onClick={handleButtonClick}
            disabled={disabled}
            size={size}
            width={width}
            variant={variant}
        >
            {icon && <img src={icon} alt="icon" />}
            {t(translationKey)}
        </StyledButton>
    );
};

export default GeneralButton;