import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MaterialData } from '../../api/types/materialData';
import materialsApi from '../../api/methods/materialsApi';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';

export interface MaterialsState extends ExtendedUpdateSliceState {
  materials: MaterialData[] | null;
}

const initialState: MaterialsState = createExtendedUpdateState({
  materials: null,
})

export const fetchMaterialsAsync = createAsyncThunk(
  'tradePointsList/fetchMaterialsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await materialsApi.getAllMaterials();
      return response;
    } catch (error: any) {
      if (error.status === 401) {
        window.location.reload();
      }
      
      return rejectWithValue(error.message || 'Failed to fetch materials');
    }
  }
);

export const updateMaterials = () => {
  return (dispatch: any) => {
    materialsApi.subscribeForUpdateMaterials(dispatch);
  };
};

const materialsSlice = createSlice({
  name: 'materialsSlice',
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
      state.updateMessage = 'MaterialsUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.loading = false;
      state.updateMessage = 'MaterialUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.loading = false;
      state.updateMessage = 'MaterialErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialsAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchMaterialsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterialsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.payload as string;
      });
  },
});

export const { resetState, updatePending, updateFulfilled, updateRejected } = materialsSlice.actions;

export default materialsSlice.reducer;
