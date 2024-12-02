import Board from "./pages/Boards/_id";
import NotFound from "./pages/404/NotFound";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";

function App() {
  // const navigate = useNavigate();

  return (
    <Routes>
      {/* Board detail */}
      <Route
        path="/"
        element={
          <Navigate to="/boards/6623655c42a019242c046fcd" replace={true} />
        }
      />
      <Route path="/boards/:boardId" element={<Board />} />
      {/* (*) là trường hợp không match với route nào ở trên */}

      {/* authentication */}
      <Route path="/register" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
