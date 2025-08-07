import Box from "@mui/system/Box";
import { toast } from "react-toastify";
import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ListCards from "./ListCards/ListCards";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
// dndkit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useConfirm } from "material-ui-confirm";

import {
  createNewCardAPI,
  deleteColumnDetailsAPI,
  updateColumnDetailsAPI,
} from "~/apis";
import { cloneDeep } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";

const Column = ({ column }) => {
  // sắp xếp card
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyles = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  // đóng mở dropdown
  const dispatch = useDispatch();
  const board = useSelector((state) => state.activeBoard.currentActiveBoard);
  const orderedCards = column.cards;
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  };
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error("Please enterr Card title");
      return;
    }
    //  gọi API ở đây
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    // cập nhật state board
    // dùng cloneDeep để tạo ra một bản sao mới của object board liên quan tới rule của redux
    /**
      * Cannot assig to read only property 'cards' of object
      * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only - (nested
      object - can thiệp sâu dữ liệu)
      **/
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    // hàm some js cũng duyệt mảng trả về true false với đk là hàm callback bên trong, khi có kết quả nó trả về luôn và dùng vòng lặp
    if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
      columnToUpdate.cards = [createdCard];
      columnToUpdate.cardOrderIds = [createdCard._id];
    } else {
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }
    dispatch(updateCurrentActiveBoard(newBoard));
    // đóng trạng thái
    toggleOpenNewCardForm();
    setNewCardTitle("");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const confirmDeleteColumn = useConfirm();
  // xử lý xóa một column và cards
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: "Delete Column?",
      description:
        "This action will permanently delete your Column and its Cards! Are you sure?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      // cancellationButtonProps: { color: 'inherit' },

      // description: 'phải nhập chữ "tquandoo" mới được confirm',
      // confirmationKeyword: 'tquandoo'
    })
      .then(() => {
        // update chuẩn dữ liệu state board
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (_id) => _id !== column._id
        );
        dispatch(updateCurrentActiveBoard(newBoard));

        // Gọi API Backend
        deleteColumnDetailsAPI(column._id).then((res) => {
          toast.success(res?.deleteResult);
        });
      })
      .catch(() => {});
  };

  const onUpdateColumnTitle = (newTitle) => {
    // gọi API update Column và xử lý dữ liệu board trong redux
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board);
      console.log("🚀 ~ onUpdateColumnTitle ~ newBoard:", newBoard);
      const colummToUpdate = newBoard.columns.find((c) => c._id === column._id);
      if (colummToUpdate) {
        colummToUpdate.title = newTitle;
      }
      dispatch(updateCurrentActiveBoard(newBoard));
    });
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: "300px",
          maxWidth: "300px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          ml: 2,
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} )`,
        }}
      >
        {/* Box column header */}
        <Box
          sx={{
            height: (theme) => {
              theme.trello.columnHeaderHeight;
            },
            p: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-dnd="true"
          />
          <Box>
            <Tooltip title="More-options">
              <ExpandMoreIcon
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-dropdown",
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .add-card-icon": {
                      color: "success.light",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCardIcon fontSize="small" className="add-card-icon" />
                </ListItemIcon>
                <ListItemText>Add New Card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Page</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .delete-forever-icon": {
                      color: "warning.dark",
                    },
                  },
                }}
              >
                <ListItemIcon className="delete-forever-icon">
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Web Clipboard</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/*  list cards */}

        <ListCards cards={orderedCards} />
        {/* Box column footer */}

        <Box
          sx={{
            height: (theme) => {
              theme.trello.columnFooterHeight;
            },
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add New Card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                // sx={{ minWidth: "120px" }}
                label="Enter card title"
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "$ .MuiOutlinedInput-input": {
                      borderRadius: 1,
                    },
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  className="interceptor-loading"
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadown: "none",
                    border: "0.5px solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: "pointer",
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};
export default Column;
