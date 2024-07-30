import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productRemainsApi from '../../api/methods/productRemainsApi';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ProductsRemain } from '../../api/types/productsRemain';
import { UNAUTHORIZED_STATUS_CODE } from '../../data/constants/constants';

export interface ProductRemainsState extends ExtendedUpdateSliceState {
    productRemains: ProductsRemain[] | null;
}

const initialState: ProductRemainsState = createExtendedUpdateState({
    productRemains: null,
});

export const fetchProductRemainsAsync = createAsyncThunk(
    'productRemains/fetchProductRemainsAsync',
    async (branchOfficeId: number, { rejectWithValue }) => {
        try {
            const response = await productRemainsApi
                .getAllProductRemainsByBranchOfficeId(branchOfficeId);
            return response;
        } catch (error: any) {
            if (error.response.status === UNAUTHORIZED_STATUS_CODE) {
                window.location.reload();
            }

            return rejectWithValue(error.message || 'Failed to fetch product remains');
        }
    },
);

export const updateProductRemains = (branchOfficeId: number) => {
    return (dispatch: any) => {
        productRemainsApi.subscribeForUpdateProductRemains(
            dispatch,
            branchOfficeId,
        );
    };
};

const productRemainsSlice = createSlice({
    name: 'productRemains',
    initialState,
    reducers: {
        resetState: (state) => {
            state.updateStatus = 'idle';
            state.updateMessage = null;
        },
        updatePending: (state) => {
            state.updateStatus = 'pending';
            state.updateMessage = 'ProductsRemainsUpdPending';
        },
        updateFulfilled: (state) => {
            state.updateStatus = 'success';
            state.updateMessage = 'ProductRemainUpdSuccess';
        },
        updateRejected: (state) => {
            state.updateStatus = 'error';
            state.updateMessage = 'ProductRemainErrorMessage';
        },
        clearRemains: (state) => {
            state.productRemains = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductRemainsAsync.pending, (state) => {
                state.loading = true;
                state.errorTranslationKey = null;
            })
            .addCase(fetchProductRemainsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.errorTranslationKey = null;
                state.productRemains = action.payload;
            })
            .addCase(fetchProductRemainsAsync.rejected, (state, action) => {
                state.loading = false;
                state.errorTranslationKey = action.error.message || 'Failed to fetch product remains';
            })
    },
});

export const {
    resetState,
    updatePending,
    updateFulfilled,
    updateRejected,
    clearRemains,
} = productRemainsSlice.actions;

export default productRemainsSlice.reducer;
