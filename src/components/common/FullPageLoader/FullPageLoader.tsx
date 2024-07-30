import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './styles/FullPageLoader.module.css';

const FullPageLoader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <CircularProgress color="error"/>
    </div>
  );
};

export default FullPageLoader;
