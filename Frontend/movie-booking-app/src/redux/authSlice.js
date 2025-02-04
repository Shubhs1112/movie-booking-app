import { createSlice } from '@reduxjs/toolkit';

// Create an initial state for the auth slice
const initialState = {
  isAuthenticated: false,
  user: null, // user details (could be an object or null initially)
  error: null, // store errors if any (e.g., invalid credentials)
};

// Create the auth slice with actions and reducers
const authSlice = createSlice({
  name: 'auth', // The name of the slice
  initialState, // The initial state of the slice
  reducers: {
    // Action to set the user when they log in
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // User data from the login response
      state.error = null;
    },
    // Action to clear the user when they log out
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    // Action to set error (e.g., wrong credentials)
    setError: (state, action) => {
      state.error = action.payload; // Set the error message
    },
  },
});

// Export actions for login, logout, and setError
export const { login, logout, setError } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
