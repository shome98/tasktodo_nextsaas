import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentMode } from '@/types/requiredtypes';
import { fetchPaymentModes, createOrUpdatePaymentMode, deletePaymentMode } from '@/lib/server/paymentmode.actions';

export const fetchPaymentModesThunk = createAsyncThunk('paymentModes/fetch', async () => {
  return await fetchPaymentModes();
});

export const createOrUpdatePaymentModeThunk = createAsyncThunk(
  'paymentModes/createOrUpdate',
  async (data: { name: string; _id?: string }) => {
    return await createOrUpdatePaymentMode(data);
  }
);

export const deletePaymentModeThunk = createAsyncThunk('paymentModes/delete', async (id: string) => {
  await deletePaymentMode(id);
  return id;
});

const paymentModeSlice = createSlice({
  name: 'paymentModes',
  initialState: {
    items: [] as PaymentMode[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentModesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentModesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPaymentModesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payment modes';
      })
      .addCase(createOrUpdatePaymentModeThunk.fulfilled, (state, action) => {
        const paymentMode = action.payload;
        const index = state.items.findIndex((pm) => pm._id === paymentMode._id);
        if (index >= 0) {
          state.items[index] = paymentMode;
        } else {
          state.items.push(paymentMode);
        }
      })
      .addCase(deletePaymentModeThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((pm) => pm._id !== action.payload);
      });
  },
});

export default paymentModeSlice.reducer;