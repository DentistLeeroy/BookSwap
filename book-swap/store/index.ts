import { configureStore } from '@reduxjs/toolkit';

// Import your reducers
import { counterReducer } from './counter';

// Create the store
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
