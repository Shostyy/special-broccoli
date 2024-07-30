import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rolesApi from '../../api/methods/rolesApi';
import { Role } from '../../api/types/role';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface LoginState {
    loading: boolean;
    error: string | null;
    allRoles: Role[] | null;
}

// Async thunk to fetch user info
export const fetchAllRoles = createAsyncThunk(
    'registerNewUser/fetchAllUsers',
    async () => {
        try {
            const response = await rolesApi.getAllRoles();

            return response;
        } catch (error: any) {
            if (error.status === UNAUTHORIZED_STATUS_CODE) {
                window.location.reload();
            }
            return null;
        }
    },
);

const initialState: LoginState = {
    loading: false,
    error: null,
    allRoles: null,
};

const loginSlice = createSlice({
    name: 'registerNewUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handling login async thunk
            .addCase(fetchAllRoles.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error state
            })
            .addCase(fetchAllRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.allRoles = action.payload;
            })
            .addCase(fetchAllRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch user info';
            });
    },
});

export default loginSlice.reducer;
