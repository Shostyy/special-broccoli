import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import branchOfficesApi from '../../api/methods/branchOfficesApi';
import { BranchOffice } from '../../api/types/branchOffice';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';

export interface BranchOfficesState extends ExtendedUpdateSliceState {
    branchOffices: BranchOffice[] | null;
}

const initialState: BranchOfficesState = createExtendedUpdateState({
    branchOffices: null,
});

export const fetchBranchOfficesAsync = createAsyncThunk(
    'branchOffices/fetchBranchOffices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await branchOfficesApi.getAllBranchOffices();
            return response;
        } catch (error: any) {
            console.log(error);
            if (error.status === 401) {
                window.location.reload();
            }

            return rejectWithValue(error.message || 'Failed to fetch branch offices');
        }
    }
);

export const updateBranchOffices = () => {
    return (dispatch: any) => {
        branchOfficesApi.subscribeForUpdateBranchOffices(dispatch);
    };
};

const branchOfficeSlice = createSlice({
    name: 'branchOffices',
    initialState,
    reducers: {
        resetState: (state) => {
            state.updateStatus = 'idle';
            state.updateMessage = null;
        },
        updatePending: (state) => {
            state.updateStatus = 'pending';
            state.updateMessage = 'BranchOfficeUpdPending';
        },
        updateFulfilled: (state) => {
            state.updateStatus = 'success';
            state.updateMessage = 'BranchOfficeUpdSuccess';
        },
        updateRejected: (state) => {
            state.updateStatus = 'error';
            state.updateMessage = 'BranchOfficeErrorMessage';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranchOfficesAsync.pending, (state) => {
                state.loading = true;
                state.errorTranslationKey = null;
            })
            .addCase(fetchBranchOfficesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.errorTranslationKey = null;
                state.branchOffices = action.payload;
            })
            .addCase(fetchBranchOfficesAsync.rejected, (state, action) => {
                state.loading = false;
                state.errorTranslationKey = action.error.message || 'Failed to fetch branch offices';
                state.branchOffices = [];
            })
    }
});

export const { resetState, updatePending, updateFulfilled, updateRejected } = branchOfficeSlice.actions;

export default branchOfficeSlice.reducer;
