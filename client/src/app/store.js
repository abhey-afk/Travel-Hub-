import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApiSlice } from '../features/auth/authApiSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

// Enable the refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store; 