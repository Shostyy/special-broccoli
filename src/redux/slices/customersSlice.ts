import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CustomerData } from '../../api/types/customerData';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import customersApi from '../../api/methods/customersApi';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface CustomersState extends ExtendedUpdateSliceState {
  customers: CustomerData[] | null;
}

const initialState: CustomersState = createExtendedUpdateState({
  customers: null,
});

export const fetchCustomersAsync = createAsyncThunk(
  'users/fetchCustomersAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customersApi.getAllCustomers();
      return response;
    } catch (error: any) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }

      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  },
);

export const updateCustomers = () => {
  return (dispatch: any) => {
    customersApi.subscribeForUpdateCustomers(dispatch);
  };
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    resetState: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = null;
    },
    updatePending: (state) => {
      state.updateStatus = 'pending';
      state.updateMessage = 'CustomersUpdPending';
    },
    updateFulfilled: (state) => {
      state.updateStatus = 'success';
      state.updateMessage = 'CustomerUpdSuccess';
    },
    updateRejected: (state) => {
      state.updateStatus = 'error';
      state.updateMessage = 'CustomerErrorMessage';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.loading = true;
        state.errorTranslationKey = null;
      })
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomersAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorTranslationKey = action.error.message || 'Failed to fetch customers';
      });
  },
});

export const {
  resetState,
  updatePending,
  updateFulfilled,
  updateRejected,
} = customersSlice.actions;

export default customersSlice.reducer;
