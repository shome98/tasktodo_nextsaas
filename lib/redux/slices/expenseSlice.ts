import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Expense } from '@/types/requiredtypes';
import { fetchExpenses, createOrUpdateExpense, deleteExpense } from '@/lib/server/expense.actions';

export const fetchExpensesThunk = createAsyncThunk('expenses/fetch', async () => {
  return await fetchExpenses();
});

export const createOrUpdateExpenseThunk = createAsyncThunk(
  'expenses/createOrUpdate',
  async (data: {
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    type: 'credit' | 'debit';
    status: 'due' | 'paid' | 'refunded';
    _id?: string;
  }) => {
    return await createOrUpdateExpense(data);
  }
);

export const deleteExpenseThunk = createAsyncThunk('expenses/delete', async (id: string) => {
  await deleteExpense(id);
  return id;
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [] as Expense[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpensesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpensesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(createOrUpdateExpenseThunk.fulfilled, (state, action) => {
        const expense = action.payload;
        const index = state.items.findIndex((e) => e._id === expense._id);
        if (index >= 0) {
          state.items[index] = expense;
        } else {
          state.items.push(expense);
        }
      })
      .addCase(deleteExpenseThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;