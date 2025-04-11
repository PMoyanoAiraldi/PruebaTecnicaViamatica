import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./userReducer";
import  sessionReducer  from "./sessionReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        session: sessionReducer
    }
})

export default store;