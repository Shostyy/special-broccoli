import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClient } from '../../api/fetchClient';
import { CustomerInfo } from '../../api/types/customerInfo';
import { BASE_URL } from '../../data/constants/constants';

export interface CustomersState {
  loading: boolean;
  error: string | null;
  customersInfo: CustomerInfo[] | null;
}

// Async thunk to fetch user info
export const fetchCustomersAsync = createAsyncThunk(
  'users/fetchUsersAsync',
  async () => {
    const response = await fetchClient.get<CustomerInfo[]>(`${BASE_URL}/api/users/user-customers`);
    return response;
  }
);

const initialState: CustomersState = {
  loading: false,
  error: null,
  customersInfo: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.customersInfo = action.payload;
      })
      .addCase(fetchCustomersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user info';
      });
  },
});

export default customersSlice.reducer;
