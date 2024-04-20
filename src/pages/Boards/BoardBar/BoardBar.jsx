import Box from "@mui/system/Box";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatters";
// import { NoEncryption } from "@mui/icons-material";
const MENU_STYLE = {
  backgroundColor: "transparent",
  color: "white",
  border: " none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
};
const BoardBar = ({ board }) => {
  return (
    <Box
      sx={{
        // backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        "&::-webkit-scrollbar-track": {
          m: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={board.description}>
          <Chip
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
            sx={MENU_STYLE}
          />
        </Tooltip>
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          sx={MENU_STYLE}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b0be" },
            },
          }}
        >
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/324262532_848171996484503_6650764803128788135_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=dd5e9f&_nc_eui2=AeGgBXf99xgL0kCiwmY-NSmDgXkT5tS0--eBeRPm1LT755I7YLvNrdWrOvVvPWITvbyHYnnwNRc9BnbNskKiJ-WX&_nc_ohc=mh1fFS8ZD-AAX-VgsH2&_nc_ht=scontent.fhan14-3.fna&oh=00_AfBLm0dqLLqoYq8Mo8LX37H28iq1FqgOQwqA00JNd2NTNw&oe=657FD5AC"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/365770753_275378225215172_6901578517584525133_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHE49YdZBF8iAfmCDNX5kNK4Jd4-JY7J4zgl3j4ljsnjB5Q1Fczbt0zdX0VecSjkyiXw_LGlo-Wk_Tq617qqMt6&_nc_ohc=KQJdE4hyXYoAX_qMGFW&_nc_ht=scontent.fhan20-1.fna&oh=00_AfAU6AzZQIOFehOo0Crq-PdJTFeKOMEYhH6bL8jOUN2UBw&oe=657B46E1"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/404561205_332424839510510_1755663990759119024_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeE2Dy6sBXJod7sXxmgyAQHvRgoAVORf4kFGCgBU5F_iQX4awDz5fKLpL-E3L3z9-UCIg8AVz2aLJEjdhYYjb7GW&_nc_ohc=Q51fZbrT2EUAX_BNjNS&_nc_ht=scontent.fhan14-4.fna&oh=00_AfBMZdj5QXLDewA-jUM4uNPtkUPHszCI44dts0XSJtQfhA&oe=657FF952"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/345920207_3380602718823001_9006889886302857923_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9c7eae&_nc_eui2=AeE0tYgmdmKp2RtQl9awUHJ4I4kQ-E1RtUgjiRD4TVG1SGi-GmbJMIVwMA7vuzg7678W7RxqCH5oCwYi8YPCVcCJ&_nc_ohc=K5hBj72C4NAAX_R2X6F&_nc_ht=scontent.fhan14-2.fna&oh=00_AfBBzyKtInbejMhf60IJKJXqmGtFWc8GVbbLMUldZTgusQ&oe=657FFA5B"
            />
          </Tooltip>
          <Tooltip title="Tquandoo">
            <Avatar
              alt="Tquandoo"
              src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/419873835_362463746506619_3905469401316009793_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE6QrMBGcF6XH4ADpuJnfFYV0cvnl2J6HdXRy-eXYnodzCSvtBA1BfhxVuksPxLhwG7cXQW63FtFy1FQV8LAfP2&_nc_ohc=8dTU3Hy0HoQAb5OeifZ&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCErRSnM9JgWoDIhjTb6jqxoZqps4LuMLtMgQQPkeb_vA&oe=661AF1AA"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
};
export default BoardBar;
