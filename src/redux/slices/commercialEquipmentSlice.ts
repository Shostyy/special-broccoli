import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commercialEquipmentApi from '../../api/methods/commercialEquipmentApi';
import { CommercialEquipment } from '../../api/types/commercialEquipment';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface CommercialEquipmentState extends ExtendedUpdateSliceState {
  commercialEquipment: CommercialEquipment[] | null;
}

const initialState: CommercialEquipmentState = createExtendedUpdateState({
  commercialEquipment: null,
});

export const fetchCommercialEquipmentAsync = createAsyncThunk(
  'tradePointsList/fetchCommercialEquipmentAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await commercialEquipmentApi.getAllCommercialEquipment();
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }

      return rejectWithValue(error.message || 'Failed to fetch commercial equipment');
    }
  },
);

export const updateCommercialEquipment = () => {
  return (dispatch: any) => {
    commercialEquipmentApi.subscribeForUpdateCommercialEquipment(dispatch);
  };
};

const commercialEquipment = createSlice({
  name: 'commercialEquipmentSlice',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'CommercialsUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'CommercialEquipmentUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'CommercialEquipmentErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommercialEquipmentAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchCommercialEquipmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.commercialEquipment = action.payload;
      })
      .addCase(fetchCommercialEquipmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.payload as string;
      });
  },
});

export const {
  resetState,
  updatePending,
  updateFulfilled,
  updateRejected,
} = commercialEquipment.actions;

export default commercialEquipment.reducer;
