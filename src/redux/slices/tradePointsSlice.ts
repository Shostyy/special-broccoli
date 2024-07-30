import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { TradePointData } from '../../api/types/tradePointData';
import tradePointsApi from '../../api/methods/tradePointsApi';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface TradePointsState extends ExtendedUpdateSliceState {
  tradePoints: TradePointData[] | null;
}

const initialState: TradePointsState = createExtendedUpdateState({
  tradePoints: null,
});

export const fetchTradePointAsync = createAsyncThunk(
  'users/fetchTradePointAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tradePointsApi.getAllTradePoints();
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }

      return rejectWithValue(error.message || 'Failed to fetch materials');
    }
  },
);

export const updateTradePoints = () => {
  return (dispatch: any) => {
    tradePointsApi.subscribeForUpdateTradePoints(dispatch);
  };
}

const tradePointsSlice = createSlice({
  name: 'tradePoints',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'TradesUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'TradePointUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'TradePointErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradePointAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchTradePointAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tradePoints = action.payload;
      })
      .addCase(fetchTradePointAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.error.message || 'Failed to fetch trade points';
      });
  },
});

export const {
  resetState,
  updatePending,
  updateFulfilled,
  updateRejected,
} = tradePointsSlice.actions;

export default tradePointsSlice.reducer;
