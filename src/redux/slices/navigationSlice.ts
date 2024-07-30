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
    },
    openNavigation(state) {
      state.isNavigationOpen = true;
    },
    closeNavigation(state) {
      state.isNavigationOpen = false;
    },
  },
});

export const { 
  toggleNavigation, 
  openNavigation, 
  closeNavigation,
} = loginSlice.actions;

export default loginSlice.reducer;
