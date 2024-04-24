import Box from "@mui/system/Box";
import { toast } from 'react-toastify'
import { Typography } from "@mui/material";
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

const Column = ({ column, createNewCard }) => {
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
  const orderedCards = column.cards
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enterr Card title')
      return
    }
    //  gọi API ở đây
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    createNewCard(newCardData)
    // đóng trạng thái 
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More-options">
              <ExpandMoreIcon
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ color: "text.primary", cursor: "poiter" }}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-dropdown",
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize="small" />
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
              <MenuItem>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
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
          {
            !openNewCardForm
              ?
              <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add New Card</Button>
                <Tooltip title="Drag to move">
                  <DragHandleIcon sx={{ cursor: "pointer" }} />
                </Tooltip>
              </Box>
              :
              <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
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
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                    },
                    "& label.Mui-focused": { color: (theme) => theme.palette.primary.main },
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
                      '$ .MuiOutlinedInput-input': {
                        borderRadius: 1,
                      }
                    },
                  }}
                />

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
                >
                  <Button
                    onClick={addNewCard}
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{
                      boxShadown: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&:hover': { bgcolor: (theme) => theme.palette.success.main }
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
          }

        </Box>
      </Box>
    </div>
  );
};
export default Column;
