    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import axios from 'axios';

    export const fetchMenuByUserId = createAsyncThunk(
    'menu/fetchMenuByUserId',
        async (idUser, thunkAPI) => {
            try{
                

                const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3010/menu/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
                });

            return res.data; 
            } catch (error) {
                console.error('ERROR AL OBTENER MENÚ:', error);
            return thunkAPI.rejectWithValue(error.message);
            }
    }
        );

    const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearMenu: (state) => {
        state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMenuByUserId.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchMenuByUserId.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loading = false;
        })
        .addCase(fetchMenuByUserId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
    });

    export const { clearMenu } = menuSlice.actions;
    const menuReducer =  menuSlice.reducer;
    export default menuReducer;
