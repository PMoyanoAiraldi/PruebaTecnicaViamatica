import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    login: false,
    user: {
        idUser: null,
        username: '',
        email: '',
        status: '',
        failedAttempts: 0,
        rolesUsers: [], 
        person: null, 
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
            login: (state, action) => {
                state.login = true; 
                state.user = action.payload;
        },

        logout: (state) => {
            state.login = false,
            state.user = initialState.user
        },  

        updateUserStatus: (state, action) => {
        state.user.status = action.payload;

        },

        incrementFailedAttempts: (state) => {
        state.user.failedAttempts += 1;

        }
    },
});       

export const { login, logout, updateUserStatus, incrementFailedAttempts } = userSlice.actions
const userReducer = userSlice.reducer;
export default userReducer;