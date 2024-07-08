import { baseInitialState } from '../state/baseInitialState';
import { BaseSliceState } from '../types/baseSliceState';

export const createInitialState = <T extends object>(additionalState: T): T & BaseSliceState => {
    return {
      ...baseInitialState,
      ...additionalState,
    };
  };