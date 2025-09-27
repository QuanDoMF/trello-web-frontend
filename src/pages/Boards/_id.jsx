// import Box from "@mui/system/Box";
import { Container } from "@mui/material";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect } from "react";
import { cloneDeep } from "lodash";
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useParams } from "react-router-dom";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const activeCard = useSelector(selectCurrentActiveCard);
  const { boardId } = useParams();

  useEffect(() => {
    // const boardId = "6623655c42a019242c046fcd";
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  // Func này có nhiệm vụ gọi API và xử lý kéo thả Column xong xuôi
  // chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó(thay đổi vị trí trong mảng)
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // gọi API update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  // di chuyển card trong cùng column
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardsIds,
    columnId
  ) => {
    // update cho chuẩn dữ liệu state board

    /**
    * Cannot assig to read only property 'cards' of object
    * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only - (nested
    object - can thiệp sâu dữ liệu)
  **/
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardsIds;
    }
    dispatch(updateCurrentActiveBoard(newBoard));

    // gọi API update column

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds });
  };

  // di chuyển card sang column khác

  /**
   * Khi di chuyển card sang column khác:
   * B1: cần cập nhật mảng cardOrderIds của Column ban đầu chưa nó(Là xóa _id của Card đó ra khỏi mảng)
   * B2: cần cập nhật mảng cardOrderIds của Column tiếp theo (Là thêm _id của Card đó vào mảng)
   * B3: cập nhật ColumnId mới của card đã kéo
   * =>   làm một API support riêng
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // nếu column rỗng tạo FE_placeholder-card thì gửi lên BE đã validation objectId thì sẽ k hiểu placeholder-card là gì
    let prevCardOrderIds = dndOrderedColumns.find(
      (column) => column._id === prevColumnId
    )?.cardOrderIds;
    // nên trước khi gửi lên BE sẽ set prevCardOrderIds là mảng rỗng
    if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      // lấy ra cardOrderIds của column cũ
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(
        (column) => column._id === nextColumnId
      )?.cardOrderIds,
    });
    // gọi API xử lý phía BE
  };

  // Xử lý xóa một Column và Cards bên trong nó

  if (!board) {
    return <PageLoadingSpinner caption="Loading board..." />;
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* mỗi thời điểm chỉ tồn tại 1 modal ActiveCard */}
      {activeCard && <ActiveCard />}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
};
export default Board;
