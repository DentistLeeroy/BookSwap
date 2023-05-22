import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';


interface BookState {
  likedBooks: Book[];
  dislikedBooks: Book[];
}

interface Book {
  id: number;
  title: string;
  image: string;
}

const initialState: BookState = {
  likedBooks: [],
  dislikedBooks: [],
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    likeBook: (state, action: PayloadAction<Book>) => {
      state.likedBooks.push(action.payload);
    },
    dislikeBook: (state, action: PayloadAction<Book>) => {
      state.dislikedBooks.push(action.payload);
    },
  },
});

export const { likeBook, dislikeBook } = bookSlice.actions;

const store = configureStore({
  reducer: {
    book: bookSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
