import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userData: null,
    accessToken: null,
    refreshToken: null,
};


export const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        setUser: (
            state,
            action
        ) => {
            return {
                ...state,
                userData: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            };
        },
        removeUser: (state, action) => {
            return {
                userData: null,
                accessToken: null,
                refreshToken: null,
            }
        },
        updateUser: (state, action) => {
            return {
                ...state,
                userData: action.payload.user,
            }
        }
    },
});
// Action creators are generated for each case reducer function
export const {
    setUser,
    removeUser,
    updateUser,
} = userSlice.actions;
export default userSlice.reducer;