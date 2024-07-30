import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  error: boolean;
  errorKey: string | null;
}

const initialState: AppState = {
  error: false,
  errorKey: null,
};

const appErrorSlice = createSlice({
  name: 'appError',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<{ error: boolean; errorKey: string | null }>) => {
      state.error = action.payload.error;
      state.errorKey = action.payload.errorKey;
    },
    clearError: (state) => {
      state.error = false;
      state.errorKey = null;
    },
  },
});

export const { setError, clearError } = appErrorSlice.actions;
export default appErrorSlice.reducer;