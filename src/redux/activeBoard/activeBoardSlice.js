
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizeAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from "~/utils/sorts";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";

const initialState = {
    currentActiveBoard: null
}

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
})


export const activeBoardSlice = createSlice({
    name: "activeBoard",
    initialState,
    reducers: {
        updateCurrentActiveBoard: (state, action) => {
            // gán action.payload ra một biến có ý nghĩa hơn
            const board = action.payload;

            // update lại dữ liệu
            state.currentActiveBoard = { ...board };
        },
        updateCardInBoard: (state, action) => {
            const incomingCard = action.payload;

            const column = state.currentActiveBoard.columns.find(column => column._id === incomingCard.columnId);
            if (column) {
                const card = column.cards.find(card => card._id === incomingCard._id)
                if (card) {
                    // card.title = incomingCard.title;
                    Object.keys(incomingCard).forEach(key => {
                        card[key] = incomingCard[key];
                    })
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
                let board = action.payload;
                board.FE_allUsers = board.owners.concat(board.members)
                board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
                board.columns.forEach(column => {
                    // khi f5 trang web thì cần xử lí vấn đề kéo thả vào một column rỗng
                    if (isEmpty(column.cards)) {
                        column.cards = [generatePlaceholderCard(column)]
                        column.cardOrderIds = [generatePlaceholderCard(column)._id]
                    }
                    else {
                        //sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
                        column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
                    }
                })
                state.currentActiveBoard = action.payload;
            })
    }
})

export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions;

// Selector:
export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard;
export const activeBoardReducer = activeBoardSlice.reducer;