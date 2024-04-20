// import Box from "@mui/system/Box";
import { Container } from "@mui/material";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect, useState } from "react";
import { fetchBoardDetailsAPI } from "~/apis";
import { mockData } from "~/apis/mock-data";
const Board = () => {
  const [board, setBoard] = useState([])
  // useEffect(() => {
  //   const boardId = '6623655c42a019242c046fcd'
  //   fetchBoardDetailsAPI(boardId).then(board => {
  //     setBoard(board)
  //   })
  // }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={mockData.board} />
      <BoardContent board={mockData.board} />
    </Container>
  );
};
export default Board;
