import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import categoriesApi from '../../api/methods/categoriesApi';
import { CategoryData } from '../../api/types/categoryData';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface CategoriesState extends ExtendedUpdateSliceState {
  categories: CategoryData[] | null;
}

const initialState: CategoriesState = createExtendedUpdateState({
  categories: null,
});

export const fetchCategoriesAsync = createAsyncThunk(
  'users/fetchCategoriesAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getAllCategories();
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }
      return rejectWithValue(error.message || 'Failed to fetch materials');
    }
  },
);

export const updateCategories = () => {
  return (dispatch: any) => {
    categoriesApi.subscribeForUpdateCategories(dispatch);
  };
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'CategoriesUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'CategoriesUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'CategoriesErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
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
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
