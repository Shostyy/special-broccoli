import { extendedUpdateInitialState } from '../state/extendedUpdateInitialState';
import { ExtendedUpdateSliceState } from '../types/extendedUpdateSliceState';

export const createExtendedUpdateState = <T extends object>(additionalState: T): T & ExtendedUpdateSliceState => {
    return {
      ...extendedUpdateInitialState,
      ...additionalState,
    };
  };