import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/userSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <div className="navContainer">
          <Link to={"/"} className="logo">
            Book<span>Nest</span>
          </Link>
          <div className="navItems">
            {!user ? (
              <Link to={"/login"} className="navButton">
                Login
              </Link>
            ) : (
              <span>
                <span className="usernameBtn">{user?.username}</span>
                {user?.isAdmin ? (
                  <Link
                    className="dashboardBtn"
                    style={{ marginRight: "1rem" }}
                    to={"/admin"}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <button
                  onClick={() => {
                    dispatch(logoutAction());
                    navigate("/");
                  }}
                  className="navButton"
                >
                  Logout
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
