import { BaseSliceState } from './baseSliceState';

export interface ExtendedUpdateSliceState extends BaseSliceState {
  updateStatus: 'idle' | 'pending' | 'success' | 'error';
  updateMessage: string | null;
}
