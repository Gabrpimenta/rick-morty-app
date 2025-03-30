import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Import the combined reducer

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
