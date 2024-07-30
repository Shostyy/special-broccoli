import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClient } from '../../api/fetchClient';
import { UserRelationshipInfo } from '../../api/types/userRelationshipInfo';
import { BASE_URL } from '../../data/constants/constants';

export interface UsersRelationshipState {
  loading: boolean;
  error: string | null;
  usersRelationshipInfo: UserRelationshipInfo[] | null;
  selectedUsedRelationship: UserRelationshipInfo | null;
}

export const fetchUsersRelationshipAsync = createAsyncThunk(
  'users/fetchUsersRelationshipAsync',
  async () => {
    const response
      = await fetchClient.get<UserRelationshipInfo[]>(`${BASE_URL}/api/users/user-customers`);
      
    return response;
  },
);

const initialState: UsersRelationshipState = {
  loading: false,
  error: null,
  usersRelationshipInfo: null,
  selectedUsedRelationship: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUserRelationship(state, action) {
      state.selectedUsedRelationship = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersRelationshipAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersRelationshipAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.usersRelationshipInfo = action.payload;
      })
      .addCase(fetchUsersRelationshipAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user info';
      });
  },
});

export const { setSelectedUserRelationship } = usersSlice.actions;

export default usersSlice.reducer;
