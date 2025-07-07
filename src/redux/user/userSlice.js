
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizeAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from '~/utils/constants'

const initialState = {
    currentUser: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
})


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUserAPI.fulfilled, (state, action) => {
                let user = action.payload;
                state.currentUser = user;
            })
    }
})

export const selectCurrentUser = (state) => state.user.currentUser;
export const userReducer = userSlice.reducer;