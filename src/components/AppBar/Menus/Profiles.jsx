import Box from "@mui/system/Box";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { loggoutUserAPI, selectCurrentUser } from "~/redux/user/userSlice";
import { useConfirm } from "material-ui-confirm";

const Profiles = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const confirmLogout = useConfirm();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    confirmLogout({
      title: "Log out of your account?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        dispatch(loggoutUserAPI(true));
      })
      .catch(() => {});
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={currentUser?.avatar}
          ></Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profiles",
        }}
      >
        <Link to="/settings/account">
          <MenuItem
            sx={{
              "&:hover": {
                color: "success.light",
              },
            }}
          >
            <Avatar
              sx={{ width: "28px", height: "28px", mr: 2 }}
              src={currentUser?.avatar}
            />
            Profile
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              color: "warning.dark",
              "& .logout-icon": {
                color: "warning.dark",
              },
            },
          }}
        >
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profiles;
