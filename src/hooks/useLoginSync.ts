import { useEffect } from 'react';

export const useLoginSync = () => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLogin') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};