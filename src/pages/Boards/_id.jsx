// import Box from "@mui/system/Box";
import { Container, Box, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect, useState } from "react";
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from "~/apis";
// import { mockData } from "~/apis/mock-data";
import { generatePlaceholderCard } from "~/utils/formatters";
import { isEmpty } from "lodash";
import { mapOrder } from "~/utils/sorts";
import { toast } from "react-toastify";
const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '6623655c42a019242c046fcd'
    fetchBoardDetailsAPI(boardId).then(board => {
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
      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ goi API tạo mới Column và làm lại dữ liệu  State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
    // cập nhật lại state board
  }
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // cập nhật state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    // hàm some js cũng duyệt mảng trả về true false với đk là hàm callback bên trong, khi có kết quả nó trả về luôn và dùng vòng lặp
    if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
      columnToUpdate.cards = [createdCard]
      columnToUpdate.cardOrderIds = [createdCard._id]
    }
    else {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API và xử lý kéo thả Column xong xuôi
  // chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó(thay đổi vị trí trong mảng)
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }
  // di chuyển card trong cùng column
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)
    // gọi API update column

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }


  // di chuyển card sang column khác

  /** 
  * Khi di chuyển card sang column khác: 
  * B1: cần cập nhật mảng cardOrderIds của Column ban đầu chưa nó(Là xóa _id của Card đó ra khỏi mảng)
  * B2: cần cập nhật mảng cardOrderIds của Column tiếp theo (Là thêm _id của Card đó vào mảng)
  * B3: cập nhật ColumnId mới của card đã kéo
  * =>   làm một API support riêng
  */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // console.log('~ file: _id ~ moveCardToDifferentColumn ~ dndOrderedColumn:', dndOrderedColumns)
    // console.log('~ file: _id ~ moveCardToDifferentColumn ~ nextColumnId:', nextColumnId)
    // console.log('~ file: _id ~ moveCardToDifferentColumn ~ prevColumnId:', prevColumnId)
    // console.log('~ file: _id ~ moveCardToDifferentColumn ~ currentCardId:', currentCardId)

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // nếu column rỗng tạo FE_placeholder-card thì gửi lên BE đã validation objectId thì sẽ k hiểu placeholder-card là gì
    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds
    // nên trước khi gửi lên BE sẽ set prevCardOrderIds là mảng rỗng
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      // lấy ra cardOrderIds của column cũ
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(column => column._id === nextColumnId)?.cardOrderIds,
    })
    // gọi API xử lý phía BE
  }

  // Xử lý xóa một Column và Cards bên trong nó

  const deleteColumnDetails = (columnId) => {
    // update chuẩn dữ liệu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((column) => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId)
    setBoard(newBoard)

    // Gọi API Backend
    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }
  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography sx={{
          fontWeight: 600,
        }}
        >
          Loading board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
};
export default Board;
