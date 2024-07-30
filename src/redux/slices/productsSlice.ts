import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductData } from '../../api/types/productData';
import productsApi from '../../api/methods/productsApi';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface ProductsState extends ExtendedUpdateSliceState {
  products: ProductData[] | null;
}

const initialState: ProductsState = createExtendedUpdateState({
  products: null,
});

export const updateProducts = () => {
  return (dispatch: any) => {
    productsApi.subscribeForUpdateProducts(dispatch);
  };
}

export const fetchProductsAsync = createAsyncThunk(
  'tradePointsList/fetchProductsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getAllProducts();
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }

      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  },
);

const productsSlice = createSlice({
  name: 'productsSlice',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'ProductsUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'ProductUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'ProductErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.payload as string;
        state.products = null;
      });
  },
});

export const {
  resetState,
  updatePending,
  updateFulfilled,
  updateRejected,
} = productsSlice.actions;

export default productsSlice.reducer;
