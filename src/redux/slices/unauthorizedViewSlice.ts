import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UnauthorizedSlice {
    errorMessage: string | null;
    errorMessageTitle: string | null;
    successMessage: string | null;
    successMessageTitle: string | null;
    additionalInfo: string | null;
}

const initialState: UnauthorizedSlice = {
    errorMessage: null,
    errorMessageTitle: null,
    successMessage: null,
    successMessageTitle: null,
    additionalInfo: null,
};

const unauthorizedViewSlice = createSlice({
    name: 'unauthorizedView',
    initialState,
    reducers: {
        setErrorMessage: (state, action: PayloadAction<{ title: string, message: string, additionalInfo?: string}>) => {
            state.errorMessageTitle = action.payload.title;
            state.errorMessage = action.payload.message;
            state.additionalInfo = action.payload.additionalInfo ? action.payload.additionalInfo : null;
        },
        setSuccessMessage: (state, action: PayloadAction<{ title: string, message: string }>) => {
            state.successMessageTitle = action.payload.title;
            state.successMessage = action.payload.message;
        },
        resetState: (state) => {
            state.errorMessage = null;
            state.errorMessageTitle = null;
            state.successMessage = null;
            state.successMessageTitle = null;
            state.additionalInfo = null;
        },
    },
});

export const { setErrorMessage, setSuccessMessage, resetState } = unauthorizedViewSlice.actions;

export default unauthorizedViewSlice.reducer;
