// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
// import { ThemeProvider } from "@mui/material/styles";
import theme from "~/theme"; // Đảm bảo bạn có file theme hợp lệ
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-right" theme="colored" autoClose={1000} />
  </CssVarsProvider>
  // </React.StrictMode>
);

// Phần còn lại của component App của bạn không thay đổi
