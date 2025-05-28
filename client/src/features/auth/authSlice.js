import { createSlice } from '@reduxjs/toolkit';

// Load auth state from localStorage if available
const loadAuthState = () => {
    try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            return {
                user: JSON.parse(userString),
                token: token
            };
        }
    } catch (error) {
        console.error('Error loading auth state from localStorage:', error);
    }
    return {
        user: null,
        token: null
    };
};

const initialState = loadAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            const { user, token } = payload;
            // Ensure all user fields are properly set
            state.user = {
                ...user,
                country: user.country || null,
                state: user.state || null,
                city: user.city || null,
                pincode: user.pincode || null,
                createdAt: user.createdAt || null
            };
            state.token = token;
            
            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;