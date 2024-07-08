import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productPricesApi from '../../api/methods/productPricesApi';
import { ExtendedUpdateSliceState } from '../shared/types/extendedUpdateSliceState';
import { createExtendedUpdateState } from '../shared/utils/createExtendedUpdateState';
import { ProductPrice } from '../../api/types/productPrice';
import { TradePointData } from '../../api/types/tradePointData';

export interface ProductPricesState extends ExtendedUpdateSliceState {
    productPrices: ProductPrice[] | null;
    selectedTradePoint: TradePointData | null;
}

const initialState: ProductPricesState = createExtendedUpdateState({
    productPrices: null,
    selectedTradePoint: null,
});

export const fetchProductPricesAsync = createAsyncThunk(
    'productPrices/fetchProductPrices',
    async (tradePointId: number, { rejectWithValue }) => {
        try {
            const response = await productPricesApi.getAllProductPricesByTradePointId(tradePointId);
            return response;
        } catch (error: any) {
            if (error.response.status === 401) {
                window.location.reload();
            }
            return rejectWithValue(error.message || 'Failed to fetch product prices');
        }
    }
);

export const updateProductPrices = (tradePointId: number) => {
    return (dispatch: any) => {
        productPricesApi.subscribeForUpdateProductPrices(dispatch, tradePointId);
    };
};

const productPricesSlice = createSlice({
    name: 'productPrices',
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
        setSelectedTradePoint: (state, action) => {
            state.selectedTradePoint = action.payload;
        },
        resetStateCompletely: (state) => {
            state = initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductPricesAsync.pending, (state) => {
                state.loading = true;
                state.errorTranslationKey = null;
            })
            .addCase(fetchProductPricesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.errorTranslationKey = null;
                state.productPrices = action.payload;
            })
            .addCase(fetchProductPricesAsync.rejected, (state, action) => {
                state.loading = false;
                state.errorTranslationKey = action.error.message || 'Failed to fetch product prices';
            })
    }
});

export const { resetState, updatePending, updateFulfilled, updateRejected, setSelectedTradePoint, resetStateCompletely } = productPricesSlice.actions;

export default productPricesSlice.reducer;
