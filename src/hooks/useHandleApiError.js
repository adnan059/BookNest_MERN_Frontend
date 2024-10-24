import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/userSlice";
import { toast } from "react-toastify";

const useHandleApiError = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleApiError = (error) => {
    const errMsg = error?.response?.data?.message;
    if (errMsg === "invalid token") {
      dispatch(logoutAction());
      toast.error("Session Expired. Please Log In.");
      navigate("/login");
    } else {
      toast.error(errMsg || "An error occurred");
    }
  };
  return handleApiError;
};

export default useHandleApiError;
