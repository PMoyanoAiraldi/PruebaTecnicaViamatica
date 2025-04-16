import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./userReducer";
import  sessionReducer  from "./sessionReducer";
import menuReducer from "./menuReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        session: sessionReducer,
        menu: menuReducer, 
    }
})

export default store;