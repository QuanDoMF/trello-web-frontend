// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { ConfirmProvider } from "material-ui-confirm"; // cấu hình mui-Dialog
// import { ThemeProvider } from "@mui/material/styles";
import theme from "~/theme"; // Đảm bảo bạn có file theme hợp lệ
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "~/redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { injectStore } from "~/utils/authorizeAxios";

// kỹ thuật inject store vào authorizeAxios
injectStore(store);
const persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename="/">
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: "xs" },
              confirmationButtonProps: {
                color: "secondary",
                variant: "outlined",
              },
              cancellationButtonProps: { color: "inherit" },

              buttonOrder: ["confirm", "cancel"],
            }}
          >
            <GlobalStyles
              styles={{
                a: { textDecoration: "none" },
              }}
            />
            <CssBaseline />
            <App />
            <ToastContainer
              position="bottom-left"
              theme="colored"
              autoClose={1000}
            />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// Phần còn lại của component App của bạn không thay đổi
