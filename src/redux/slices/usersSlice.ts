import { fetchClient } from '../../api/fetchClient';
import { UserInfo } from '../../api/types/userInfo';
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  BASE_URL,
  UNAUTHORIZED_STATUS_CODE,
} from '../../data/constants/constants';

export interface UsersState {
  loading: boolean;
  error: string | null;
  usersInfo: UserInfo[] | null;
  selectedUsed: UserInfo | null;
}

// Async thunk to fetch user info
export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsersAsync',
  async () => {
    try {
      const response
        = await fetchClient.get<UserInfo[]>(`${BASE_URL}/api/users`);

      return response;
    } catch (error: any) {
      if (error.response.status === UNAUTHORIZED_STATUS_CODE) {
        window.location.reload();
      }
      return null;
    }
  },
);

const initialState: UsersState = {
  loading: false,
  error: null,
  usersInfo: null,
  selectedUsed: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUsed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.usersInfo = action.payload;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user info';
      });
  },
});

export const { setSelectedUser } = usersSlice.actions;

export default usersSlice.reducer;
