
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { rootReducer } from "../redux/store";
type RootState = ReturnType<typeof rootReducer>;
const PrivateRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return currentUser ? <Outlet /> : <Navigate to="/signup" />;
};

export default PrivateRoute;
