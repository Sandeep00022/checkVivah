
import OAuth from "../components/Oauth.tsx";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { rootReducer } from "../redux/store.ts";
type RootState = ReturnType<typeof rootReducer>;
const Signup = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  if (currentUser) {
    <Navigate to="/" />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <OAuth />
    </div>
  );
};

export default Signup;
