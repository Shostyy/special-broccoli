import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface StyledButtonProps {
    disabled?: boolean;
    size?: 'default' | 'short';
    width?: number;
}

const StyledButton = styled.button<StyledButtonProps>`
    height: ${props => (props.size === 'short' ? '40px' : '50px')};
    width: ${props => (props.size === 'short' ? '100px' : `${props.width || 210}px`)};
    background-color: #fff;
    border: 1px solid #c25458;
    color: #c25458;
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 4px;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    padding-inline: 5px;
    &:hover {
        background-color: #f9eeef;
    }
    ${(props) => props.disabled && `
        opacity: 0.6;
        cursor: not-allowed;
    `}
`;

interface GeneralButtonProps extends StyledButtonProps {
    onClick: () => void;
    icon?: string;
    translationKey: string;
}

const GeneralButton: React.FC<GeneralButtonProps> = ({ onClick, disabled = false, icon, size = 'default', translationKey, width }) => {
    const { t } = useTranslation();

    const handleButtonClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <StyledButton
            onClick={handleButtonClick}
            disabled={disabled}
            size={size}
            width={width}
        >
            {icon && <img src={icon} alt="icon" />}
            {t(translationKey)}
        </StyledButton>
    );
};

export default GeneralButton;
