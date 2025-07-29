import Board from "./pages/Boards/_id";
import NotFound from "./pages/404/NotFound";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";
import Settings from "./pages/settings/Settings";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./redux/user/userSlice";
import Boards from "./pages/Boards";

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet />;
};
function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Board detail */}
      <Route
        path="/"
        element={
          <Navigate to="/boards/6623655c42a019242c046fcd" replace={true} />
        }
      />
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Boards */}
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/boards" element={<Boards />} />

        {/* User settings */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>
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
