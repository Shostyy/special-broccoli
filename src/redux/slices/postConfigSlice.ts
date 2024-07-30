import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostServerConfig } from '../../api/types/postServerConfig';
import postServerApi from '../../api/methods/postServerApi';

export interface EmailConfigState {
    loading: boolean;
    error: string | null;
    allConfigs: PostServerConfig[] | null;
    currentConfig: PostServerConfig | null;
}

// Async thunk to fetch all configs
export const fetchAllConfigs = createAsyncThunk(
    'postConfig/fetchAllConfigs',
    async (_, { rejectWithValue }) => {
        // Send GET request to base URL to fetch all configs
        try {
            const response = postServerApi.fetchAllConfigs();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch all post configs');
        }
    },
);

// Async thunk to fetch current config
export const fetchCurrentConfig = createAsyncThunk(
    'postConfig/fetchCurrentConfig',
    async (_, { rejectWithValue }) => {
        try {
            const response = await postServerApi.fetchCurrentConfig();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch current post config');
        }
    },
);

const initialState: EmailConfigState = {
    loading: false,
    error: null,
    allConfigs: null,
    currentConfig: null,
};

const postConfigSlice = createSlice({
    name: 'postConfig',
    initialState,
    reducers: {
        resetState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            // Handling fetching all configs async thunk
            .addCase(fetchAllConfigs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllConfigs.fulfilled, (state, action) => {
                state.loading = false;
                state.allConfigs = action.payload;
            })
            .addCase(fetchAllConfigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch configs';
            })
            // Handling fetching current config async thunk
            .addCase(fetchCurrentConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConfig = action.payload || null;
            })
            .addCase(fetchCurrentConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch current config';
            });
    },
});

export default postConfigSlice.reducer;