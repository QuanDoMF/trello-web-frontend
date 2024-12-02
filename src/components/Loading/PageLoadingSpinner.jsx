import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function PageLoadingSpinner({ caption }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  );
}

export default PageLoadingSpinner;
