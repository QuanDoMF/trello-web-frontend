import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizeAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
const initialState = {
    currentNotifications: null
}

export const fetchNotificationsAPI = createAsyncThunk('notifications/fetchNotificationsAPI', async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
})

export const updateBoardInvitationAPI = createAsyncThunk('notifications/updateBoardInvitationAPI', async (notificationId, status) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${notificationId}`, { status })
    return response.data
})
export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clearCurrentNotifications: (state) => {
            state.currentNotifications = []
        },
        updateCurrentNotifications: (state, action) => {
            state.currentNotifications = action.payload
        },
        addNotification: (state, action) => {
            const incomingInvitation = action.payload;
            state.currentNotifications.unshift(incomingInvitation);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotificationsAPI.fulfilled, (state, action) => {
            let incomingNotifications = action.payload;
            // show cái mới nhất lên trên cùng
            state.currentNotifications = Array.isArray(incomingNotifications) ? incomingNotifications.reverse() : [];
        })
        .addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
            let incomingInvitation = action.payload;
            // update lại dữ liệu
            const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id);
            getInvitation.boardInvitation = incomingInvitation.boardInvitation;
        })
    }
})

export const {
    clearCurrentNotifications,
    updateCurrentNotifications,
    addNotification
} = notificationsSlice.actions;

export const selectCurrentNotifications = (state) => state.notifications.currentNotifications;

export default notificationsSlice.reducer;