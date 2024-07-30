import React from 'react';
import { Tooltip } from '@mui/material';
import styles from './styles/TruncatedText.module.css';

interface TruncatedTextProps {
  text: string;
  maxLength: number;
  tooltipDisableThreshold?: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  tooltipDisableThreshold = 75
}) => {
  const truncatedText = text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;

  return (
    <Tooltip 
      title={text} 
      arrow 
      disableHoverListener={text.length <= tooltipDisableThreshold}
    >
      <div className={styles.truncatedText}>
        <span>{truncatedText}</span>
      </div>
    </Tooltip>
  );
};

export default TruncatedText;