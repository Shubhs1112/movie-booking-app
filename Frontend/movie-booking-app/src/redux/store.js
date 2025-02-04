import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';

// Define the persist config
const persistConfig = {
  key: 'root',
  storage, // You can change this to sessionStorage if you want the state to be reset after the session ends
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer, // The auth reducer will handle authentication state
  },
});
const persistor = persistStore(store);

export { store, persistor };

