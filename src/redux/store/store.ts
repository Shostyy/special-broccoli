import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import loginReducer from '../slices/loginSlice';
import usersReducer from '../slices/usersSlice';
import usersRelationshipReducer from '../slices/usersRelationshipSlice';
import relationshipDialogReducer from '../slices/relationshipDialogSlice';
import userCustomersReducer from '../slices/userCustomersSlice';
import navigationReducer from '../slices/navigationSlice';
import registerNewUserReducer from '../slices/registerNewUserSlice';
import postConfigReducer from '../slices/postConfigSlice';
import branchOfficesReducer from '../slices/branchOfficesSlice'; 
import customerReducer from '../slices/customersSlice';
import tradePointsReducer from '../slices/tradePointsSlice';
import productsRemainReducer from '../slices/productsRemains';
import materialsReducer from '../slices/materialsSlice';
import modelsReducer from '../slices/modelSlice';
import categoriesReducer from '../slices/categoriesSlice';
import commercialEquipmentReducer from '../slices/commercialEquipmentSlice';
import debtsReducer from '../slices/debtsSlice';
import productsReducer from '../slices/productsSlice';
import productPrices from '../slices/productPricesSlice';
import productPricesForOrders from '../slices/productPricesForOrdersSlice';
import unauthorizedViewReducer from '../slices/unauthorizedViewSlice';
import ordersReducer from '../slices/ordersSlice';

/**
 * The root state type inferred from the store's reducers.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * The dispatch function type for the store.
 */
export type AppDispatch = typeof store.dispatch;

/**
 * A thunk action type for asynchronous operations.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

/**
 * The Redux store instance configured with reducers
 */
const store = configureStore({
  reducer: {
    login: loginReducer,
    users: usersReducer,
    relationships: usersRelationshipReducer,
    userCustomers: userCustomersReducer,
    navigation: navigationReducer,
    register: registerNewUserReducer,
    relationshipDialog: relationshipDialogReducer,
    postConfig: postConfigReducer,
    branchOffices: branchOfficesReducer,
    customers: customerReducer,
    tradePoints: tradePointsReducer,
    productRemain: productsRemainReducer,
    materials: materialsReducer,
    models: modelsReducer,
    categories: categoriesReducer,
    commercialEquipment: commercialEquipmentReducer,
    debts: debtsReducer,
    products: productsReducer,
    prices: productPrices,
    pricesForOrders: productPricesForOrders,
    unauthorizedView: unauthorizedViewReducer,
    orders: ordersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
