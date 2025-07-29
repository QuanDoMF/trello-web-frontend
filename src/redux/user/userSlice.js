
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizeAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from '~/utils/constants'
import { toast } from "react-toastify";

const initialState = {
    currentUser: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
})

export const loggoutUserAPI = createAsyncThunk('user/loggoutUserAPI', async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
        toast.success('Logged out successfully!')
    }
    return response.data
})

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
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
            .addCase(loggoutUserAPI.fulfilled, (state) => {
                state.currentUser = null;
            })
            .addCase(updateUserAPI.fulfilled, (state, action) => {
                let user = action.payload;
                state.currentUser = user;
            })
    }
})

export const selectCurrentUser = (state) => state.user.currentUser;
export const userReducer = userSlice.reducer;