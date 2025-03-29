import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '@/types/requiredtypes';
import { fetchCategories, createOrUpdateCategory, deleteCategory } from '@/lib/server/category.actions';

export const fetchCategoriesThunk = createAsyncThunk('categories/fetch', async () => {
  return await fetchCategories();
});

export const createOrUpdateCategoryThunk = createAsyncThunk(
  'categories/createOrUpdate',
  async (data: { name: string; _id?: string }) => {
    return await createOrUpdateCategory(data);
  }
);

export const deleteCategoryThunk = createAsyncThunk('categories/delete', async (id: string) => {
  await deleteCategory(id);
  return id;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [] as Category[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createOrUpdateCategoryThunk.fulfilled, (state, action) => {
        const category = action.payload;
        const index = state.items.findIndex((c) => c._id === category._id);
        if (index >= 0) {
          state.items[index] = category;
        } else {
          state.items.push(category);
        }
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;