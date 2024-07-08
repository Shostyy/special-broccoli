import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserInfo } from '../../api/types/userInfo';
import loginApi from '../../api/methods/loginApi';

export interface LoginState {
  loading: boolean;
  error: string | null;
  userInfo: UserInfo | null; // Store user info once fetched
}

// Async thunk to fetch user info
export const fetchUserInfoAsync = createAsyncThunk(
  'login/fetchUserInfoAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loginApi.fetchUserInfo();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user info');
    }
  }
);

// Async thunk to log in
export const loginAsync = createAsyncThunk(
  'login/loginAsync',
  async (authData: { username: string; password: string }, { dispatch, rejectWithValue }) => {
    // Send POST request to /login with username and password
    try {
      const response = await loginApi.login(authData);
      await dispatch(fetchUserInfoAsync());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to login');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'login/logoutAsync',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi.logOut();
      dispatch(resetState());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to logout');
    }
  }
);

const initialState: LoginState = {
  loading: true,
  error: null,
  userInfo: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetState: () => initialState,
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
        state.error = action.error.message || 'Login failed';
      })
      .addCase(fetchUserInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user info';
      });
  },
});

export const { resetState } = loginSlice.actions;

export default loginSlice.reducer;
