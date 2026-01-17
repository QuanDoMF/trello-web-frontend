import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import AddIcon from "@mui/icons-material/Add";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { CARD_MEMBER_ACTIONS } from "~/utils/constants";

function CardUserGroup({ cardMemberIds = [], onUpdateCardMembers }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
  // lấy tất cả user trong board từ Redux store
  const board = useSelector(selectCurrentActiveBoard);

  const isOpenPopover = Boolean(anchorPopoverElement);
  const popoverId = isOpenPopover ? "card-all-users-popover" : undefined;
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
    else setAnchorPopoverElement(null);
  };

  const boardUsers = useMemo(() => board?.FE_allUsers || [], [board]);
  // lọc ra những user là thành viên của card
  const cardMembers = useMemo(
    () => boardUsers.filter((user) => cardMemberIds.includes(user._id)),
    [boardUsers, cardMemberIds]
  );

  // kiểm tra xem user có phải là thành viên của card không
  const isUserMemberOfCard = (userId) => {
    return cardMemberIds.includes(userId);
  };

  // xử lý click vào một user trong popover (toggle add/remove)
  const handleToggleMember = (user) => {
    if (isUserMemberOfCard(user._id)) {
      // User is already a member -> Remove
      onUpdateCardMembers({
        userId: user._id,
        action: CARD_MEMBER_ACTIONS.REMOVE,
      });
    } else {
      // User is not a member -> Add
      onUpdateCardMembers({
        userId: user._id,
        action: CARD_MEMBER_ACTIONS.ADD,
      });
    }
  };

  // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bởi nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lý phần tử tính toán cuối, đơn giản là cứ dùng Box và CSS - Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi.
  return (
    <Box sx={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {/* Hiển thị các user là thành viên của card */}
      {cardMembers.map((member) => (
        <Tooltip title={member.displayName} key={member._id}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: "pointer" }}
            alt={member.displayName}
            src={member.avatar}
          />
        </Tooltip>
      ))}

      {/* Nút này để mở popover thêm member */}
      <Tooltip title="Add new member">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "50%",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#90caf9" : "#172b4d",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "#2f3542"
                : theme.palette.grey[200],
            "&:hover": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#000000de" : "#0c66e4",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#90caf9" : "#e9f2ff",
            },
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            maxWidth: "260px",
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {boardUsers.map((user) => (
            <Tooltip title={user.displayName} key={user._id}>
              {/* Cách làm Avatar kèm badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: "pointer" }}
                overlap="rectangular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  isUserMemberOfCard(user._id) ? (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: "#27ae60" }}
                    />
                  ) : null
                }
                onClick={() => handleToggleMember(user)}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt={user.displayName}
                  src={user.avatar}
                />
              </Badge>
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}

export default CardUserGroup;
