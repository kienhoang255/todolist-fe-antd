import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = [...action.payload];
    },
    addTodo: (state, action) => {
      state.data = [action.payload, ...state.data];
    },
    editTodo: (state, action) => {
      return {
        ...state,
        data: state.data.map((e) => {
          if (e.id == action.payload.id) {
            return { ...action.payload.data };
          } else return e;
        }),
      };
    },
    markIsDone: (state, action) => {
      return {
        ...state,
        data: state.data.map((e) => {
          if (e.id == action.payload) {
            return { ...e, isDone: !e.isDone };
          } else return e;
        }),
      };
    },
    deleteTodo: (state, action) => {
      return {
        ...state,
        data: state.data.filter((e) => e.id !== action.payload),
      };
    },
  },
});

export const { setData, addTodo, editTodo, deleteTodo, markIsDone } =
  todoSlice.actions;
export default todoSlice.reducer;
