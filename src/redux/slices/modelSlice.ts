import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ModelData } from '../../api/types/modelData';
import modelsApi from '../../api/methods/modelsApi';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface ModelsState extends ExtendedUpdateSliceState {
  models: ModelData[] | null;
}

const initialState: ModelsState = createExtendedUpdateState({
  models: null,
});

export const fetchModelsAsync = createAsyncThunk(
  'tradePointsList/fetchModelAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await modelsApi.getAllModels();
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }

      return rejectWithValue(error.message || 'Failed to fetch models');
    }
  },
);

export const updateModels = () => {
  return (dispatch: any) => {
    modelsApi.subscribeForUpdateModels(dispatch);
  };
};

const modelsSlice = createSlice({
  name: 'modelsSlice',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'ModelsUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'ModelUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'ModelErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelsAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchModelsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
      })
      .addCase(fetchModelsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.payload as string;
        state.models = null;
      });
  },
});

export const {
  resetState,
  updatePending,
  updateFulfilled,
  updateRejected,
} = modelsSlice.actions;

export default modelsSlice.reducer;
