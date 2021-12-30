import { createSlice } from "@reduxjs/toolkit"

export const listSlice = createSlice({
    name: "todos",
    initialState: {
        value: [],
    },
    reducers: {
        set: (state, action) => {
            state.value = action.payload;
        },
            
    },
});

export const { set } = listSlice.actions;
export default listSlice.reducer;