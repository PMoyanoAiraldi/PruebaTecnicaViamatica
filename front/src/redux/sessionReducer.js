import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeSession: {
    id: null,
    entryDate: null,
    closingDate: null,
    },
}

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
    startSession: (state, action) => {
        state.activeSession = {
        ...action.payload,
        closingDate: null, // Se puede actualizar al cerrar sesión
        };
    },
    endSession: (state, action) => {
      state.activeSession.closingDate = action.payload; // debería ser un Date
    },
    clearSession: (state) => {
        state.activeSession = initialState.activeSession;
    }
    }
});       

export const { startSession, endSession, clearSession } = sessionSlice.actions;
const sessionReducer = sessionSlice.reducer
export default sessionReducer;