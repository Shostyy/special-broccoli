import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DebtData } from '../../api/types/debtData';
import debtsApi from '../../api/methods/debtsApi';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';

export interface DebtsState extends ExtendedUpdateSliceState {
  debts: DebtData[] | null;
}

const initialState: DebtsState = createExtendedUpdateState({
  debts: null,
});

export const fetchAllDebtsAsync = createAsyncThunk(
  'debts/fetchAllDebtsAsync',
  async ({ tradePointId, customerId }: { tradePointId?: number, customerId?: number }, { rejectWithValue }) => {
    try {
      const response = await debtsApi.getAllDebts(tradePointId, customerId);
      return response;
    } catch (error: any) {
      if (error.status === 401) {
        window.location.reload();
      }

      return rejectWithValue(error.message || 'Failed to fetch debts');
    }
  }
);

export const updateDebts = () => {
  return (dispatch: any) => {
    debtsApi.subscribeForUpdateDebts(dispatch);
  };
}

const debtsSlice = createSlice({
  name: 'debtsSlice',
  initialState,
  reducers: {
    resetState: (state) => {
        state.updateStatus = 'idle';
        state.updateMessage = null;
    },
    updatePending: (state) => {
        state.updateStatus = 'pending';
        state.loading = true;
        state.errorTranslationKey = null;
        state.updateMessage = 'DebtsUpdPending';
    },
    updateFulfilled: (state) => {
        state.updateStatus = 'success';
        state.loading = false;
        state.updateMessage = 'DebtNotification';
    },
    updateRejected: (state) => {
        state.updateStatus = 'error';
        state.loading = false;
        state.updateMessage = 'DebtErrorMessage';
    },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDebtsAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchAllDebtsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.debts = action.payload;
      })
      .addCase(fetchAllDebtsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.payload as string;
        state.debts = null;
      });
  },
});

export const { resetState, updatePending, updateFulfilled, updateRejected } = debtsSlice.actions;

export default debtsSlice.reducer;
