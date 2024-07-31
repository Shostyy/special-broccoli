import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserInfo } from '../../api/types/userInfo';
import loginApi from '../../api/methods/loginApi';
import { localClient } from '../../utils/localClient';

// Define the initial state for the login slice
const initialState: LoginState = {
  loading: false,
  error: null,
  userInfo: null,
};

// Define the interface for the login state
export interface LoginState {
  loading: boolean;
  error: string | null;
  userInfo: UserInfo | null; // Store user info once fetched
}

// Async thunk to fetch user info
export const fetchUserInfoAsync = createAsyncThunk<
  UserInfo | null, // Allow null for 401 error handling
  void, // The type of the first argument (thunk argument)
  { rejectValue: string } // The type of the returned rejection value
>(
  'login/fetchUserInfoAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginApi.fetchUserInfo();
      localClient.write('userLogin', response.login);
      return response;
    } catch (error: any) {
      if (error) {
        if (error.status === 502) {
          return rejectWithValue('Failed to fetch user info'); // Handle 502 error specifically
        } else if (error.status === 401) {
          return null; // Handle 401 without rejecting
        }
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

// Async thunk to log in
export const loginAsync = createAsyncThunk<
  void, // The returned type of the thunk
  { username: string; password: string }, // The type of the first argument (thunk argument)
  { rejectValue: string } // The type of the returned rejection value
>(
  'login/loginAsync',
  async (authData, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi.login(authData);
      await dispatch(fetchUserInfoAsync());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to login');
    }
  },
);

// Async thunk to log out
export const logoutAsync = createAsyncThunk<
  void, // The returned type of the thunk
  void, // The type of the first argument (thunk argument)
  { rejectValue: string } // The type of the returned rejection value
>(
  'login/logoutAsync',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await loginApi.logOut();
      dispatch(resetState());
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to logout');
    }
  },
);

// Create the login slice
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetState: () => initialState, // Reset the state to initial values
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(fetchUserInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Update user info
      })
      .addCase(fetchUserInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null; // Clear user info on logout
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to logout';
      });
  },
});

// Export actions and reducer
export const { resetState } = loginSlice.actions;
export default loginSlice.reducer;
