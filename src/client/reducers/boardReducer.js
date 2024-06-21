import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  board: [
		['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
		['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
		['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
	],

};

export const boardSlice = createSlice ({
  name: 'board',
  initialState,
  reducers: {

  }
});

export default boardSlice.reducer;