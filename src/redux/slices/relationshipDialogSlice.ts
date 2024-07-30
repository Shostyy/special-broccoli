import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClient } from '../../api/fetchClient';
import { UserDialog } from '../../api/types/userDialog';
import { CustomerData } from '../../api/types/customerData';
import { BASE_URL } from '../../data/constants/constants';

export interface UsersRelationshipState {
  loading: boolean;
  error: string | null;
  usersForDialog: UserDialog[] | null;
  customersForDialog: CustomerData[] | null;
}

export const fetchUsersForDialogAsync = createAsyncThunk(
  'users/fetchUsersForDialogAsync',
  async () => {
    const response = await fetchClient.get<UserDialog[]>(`${BASE_URL}/api/users/user-dialog`);
    return response;
  },
);

export const fetchCustomersForDialogAsync = createAsyncThunk(
    'users/fetchCustomersForDialogAsync',
    async () => {
      const response = await fetchClient.get<CustomerData[]>(`${BASE_URL}/api/users/customer-dialog`);
      return response;
    },
  );

const initialState: UsersRelationshipState = {
  loading: false,
  error: null,
  usersForDialog: null,
  customersForDialog: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersForDialogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersForDialogAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.usersForDialog = action.payload;
      })
      .addCase(fetchUsersForDialogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users info';
      });
      builder
      .addCase(fetchCustomersForDialogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersForDialogAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.customersForDialog = action.payload;
      })
      .addCase(fetchCustomersForDialogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers info';
      });
  },
});

export default usersSlice.reducer;
