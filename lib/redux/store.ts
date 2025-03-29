import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import categoryReducer from './slices/categorySlice';
import expenseReducer from './slices/expenseSlice';
import paymentModeReducer from './slices/paymentModeSlice';
import todoReducer from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    expenses: expenseReducer,
    paymentModes: paymentModeReducer,
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;