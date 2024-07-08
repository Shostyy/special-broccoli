import { createSlice } from '@reduxjs/toolkit';

export interface LoginState {
  isNavigationOpen: boolean;
}

const initialState: LoginState = {
  isNavigationOpen: true,
};

const loginSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleNavigation(state) {
      state.isNavigationOpen = !state.isNavigationOpen;
    }
  },
});

export const { toggleNavigation } = loginSlice.actions;

export default loginSlice.reducer;
