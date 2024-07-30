// src/components/common/HandbookPage.tsx

import React from 'react';
import { LinearProgress, CircularProgress } from '@mui/material';
import styles from './styles/HandbookPage.module.css';
import UpdateButton from '../Buttons/UpdateButton/UpdateButton';
import { SseStatuses } from '../../../types/sseStatuses';

interface HandbookPageProps<T> {
  items: T[] | null;
  loading: boolean;
  updateStatus: SseStatuses;
  handleUpdate: () => void;
  TableComponent: React.ComponentType<{ items: T[] } & any>;
  leftSideControls?: React.ReactNode;
}

function HandbookPage<T>({
  items,
  loading,
  updateStatus,
  handleUpdate,
  TableComponent,
  leftSideControls,
}: HandbookPageProps<T>) {
  return (
    <div className={styles.container}>
      <div className={styles.controlsWrapper}>
        <div className={styles.leftSideButtons}>
          {leftSideControls}
        </div>
        <div className={styles.rightSideButtons}>
          <UpdateButton onClick={handleUpdate} updateStatus={updateStatus} />
        </div>
      </div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress color='error' className={styles.loader} />
        </div>
      ) : (
        <>
          <div className={styles.progressContainer}>
            {updateStatus === 'pending' && <LinearProgress color="error" />}
          </div>
          {items && items.length > 0 && <TableComponent items={items} />}
        </>
      )}
    </div>
  );
}

export default HandbookPage;