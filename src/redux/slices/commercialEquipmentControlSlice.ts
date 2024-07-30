import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CommercialEquipmentControl } from '../../api/types/commercialEquipmentControl';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';
import commercialEquipmentControlsApi from '../../api/methods/commercialEquipmentControlsApi';

export interface CommercialEquipmentControlState extends ExtendedUpdateSliceState {
  controlHistory: CommercialEquipmentControl[] | null;
  selectedTradePoint: number | null;
  controlById: CommercialEquipmentControl | null; // New state for single control
}

const initialState: CommercialEquipmentControlState = createExtendedUpdateState({
  controlHistory: null,
  selectedTradePoint: null,
  controlById: null, // Initialize controlById
});

// Async thunk for fetching control history by trade point ID
export const fetchControlHistoryAsync = createAsyncThunk(
  'commercialEquipmentControl/fetchControlHistoryAsync',
  async ({ tradePointId }: { tradePointId: number }, { rejectWithValue }) => {
    try {
      const response = await commercialEquipmentControlsApi.getAllControlHistory(tradePointId);
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }
      return rejectWithValue(error.message || 'Failed to fetch control history');
    }
  },
);

// New async thunk for fetching control by ID
export const fetchControlByIdAsync = createAsyncThunk(
  'commercialEquipmentControl/fetchControlByIdAsync',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await commercialEquipmentControlsApi.getControlById(id);
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }
      return rejectWithValue(error.message || 'Failed to fetch control by ID');
    }
  },
);

export const updateCommercialEquipmentControls = (tradePointId: number) => {
  return (dispatch: any) => {
    commercialEquipmentControlsApi.subscribeForUpdateControls(dispatch, tradePointId);
  };
};

const commercialEquipmentControlSlice = createSlice({
  name: 'commercialEquipmentControl',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
      state.selectedTradePoint = null;
      state.controlHistory = null;
      state.controlById = null;
    },
    setSelectedTradePoint: (state, action) => {
      state.selectedTradePoint = action.payload.id;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'CommercialEquipmentControlUpdatePending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'CommercialEquipmentControlUpdateSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'CommercialEquipmentControlErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchControlHistoryAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchControlHistoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.controlHistory = action.payload;
      })
      .addCase(fetchControlHistoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.error.message || 'Failed to fetch control history';
      })
      // Handle fetch control by ID
      .addCase(fetchControlByIdAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchControlByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.controlById = action.payload; // Store the fetched control by ID
      })
      .addCase(fetchControlByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.error.message || 'Failed to fetch control by ID';
      });
  },
});

export const {
  resetState,
  setSelectedTradePoint,
  updatePending,
  updateFulfilled,
  updateRejected,
} = commercialEquipmentControlSlice.actions;

export default commercialEquipmentControlSlice.reducer;
