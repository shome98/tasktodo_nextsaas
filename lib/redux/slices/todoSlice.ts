import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '@/types/requiredtypes';
import { fetchTodos, createOrUpdateTodo, deleteTodo, toggleTodo } from '@/lib/server/todo.actions';

export const fetchTodosThunk = createAsyncThunk('todos/fetch', async () => {
  return await fetchTodos();
});

export const createOrUpdateTodoThunk = createAsyncThunk(
  'todos/createOrUpdate',
  async (data: { title: string; description: string; _id?: string }) => {
    return await createOrUpdateTodo(data);
  }
);

export const deleteTodoThunk = createAsyncThunk('todos/delete', async (id: string) => {
  await deleteTodo(id);
  return id;
});

export const toggleTodoThunk = createAsyncThunk(
  'todos/toggle',
  async ({ id, completed }: { id: string; completed: boolean }) => {
    return await toggleTodo(id, completed);
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [] as Todo[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(createOrUpdateTodoThunk.fulfilled, (state, action) => {
        const todo = action.payload;
        const index = state.items.findIndex((t) => t._id === todo._id);
        if (index >= 0) {
          state.items[index] = todo;
        } else {
          state.items.push(todo);
        }
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        const todo = action.payload;
        const index = state.items.findIndex((t) => t._id === todo._id);
        if (index >= 0) {
          state.items[index] = todo;
        }
      });
  },
});

export default todoSlice.reducer;