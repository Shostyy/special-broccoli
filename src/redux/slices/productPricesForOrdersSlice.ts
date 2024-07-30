import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productPricesApi from '../../api/methods/productPricesApi';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ProductPrice } from '../../api/types/productPrice';

export interface ProductPricesForOrdersState extends ExtendedUpdateSliceState {
    productPricesForOrders: ProductPrice[] | null;
}

const initialState: ProductPricesForOrdersState = createExtendedUpdateState({
    productPricesForOrders: null,
});

export const fetchProductPricesForOrdersAsync = createAsyncThunk(
    'productPricesForOrders/fetchProductPricesForOrdersAsync',
    async (tradePointId: number, { rejectWithValue }) => {
        try {
            const response = await productPricesApi
                .getPresentProductPricesForOrdersByTradePointId(tradePointId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch product prices');
        }
    },
);

export const updateProductPricesForOrders = (tradePointId: number) => {
    return (dispatch: any) => {
        productPricesApi.subscribeForUpdateProductPrices(
            dispatch,
            tradePointId,
            true,
        );
    };
};

const productPricesForOrdersSlice = createSlice({
    name: 'productPricesForOrders',
    initialState,
    reducers: {
        resetState: (state) => {
            state.updateStatus = 'idle';
            state.updateMessage = null;
        },
        updatePending: (state) => {
            state.updateStatus = 'pending';
            state.updateMessage = 'ProductsPricesUpdPending';
        },
        updateFulfilled: (state) => {
            state.updateStatus = 'success';
            state.updateMessage = 'ProductPriceUpdSuccess';
        },
        updateRejected: (state) => {
            state.updateStatus = 'error';
            state.updateMessage = 'ProductPriceErrorMessage';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductPricesForOrdersAsync.pending, (state) => {
                state.loading = true;
                state.errorTranslationKey = null;
            })
            .addCase(fetchProductPricesForOrdersAsync.fulfilled, (
                state,
                action,
            ) => {
                state.loading = false;
                state.errorTranslationKey = null;
                state.productPricesForOrders = action.payload;
            })
            .addCase(fetchProductPricesForOrdersAsync.rejected, (
                state,
                action,
            ) => {
                state.loading = false;
                state.errorTranslationKey = action.error.message || 'Failed to fetch product prices for orders';
            })
    },
});

export const {
    resetState,
    updatePending,
    updateFulfilled,
    updateRejected,
} = productPricesForOrdersSlice.actions;

export default productPricesForOrdersSlice.reducer;
