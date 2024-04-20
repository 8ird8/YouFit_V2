import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import { Avatar } from "@mui/material";
// import { useCart } from "./useCart";
import axios from "axios";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const { authStatus, authAdmin, verifyAdmin } = useAuth();
  const { TokenInfo, currentUserInfo, fetchCurrentUser } =
    useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const isAuthenticated = authStatus && authStatus.isAuthenticated;
  const isAdmin = authAdmin && authAdmin.isAdmin;
  const location = useLocation();
  const dropdownClasses =
    location.pathname !== "/store"
      ? "dropdown-menu bg-black absolute right-0 top-12 py-2 w-48 rounded-md shadow-xl z-20"
      : "dropdown-menu bg-black absolute right-20 mt-12 py-2 w-48 rounded-md shadow-xl z-20";

  // const { itemCount } = useCart();
  const [itemCount, setItemCount] = useState(0);

  const Logout = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    if (
      isAuthenticated &&
      (location.pathname === "/store" || location.pathname === "/mycart")
    ) {
      const fetchProducts = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/mycart/${TokenInfo.userId}`,
            {
              withCredentials: true,
            }
          );
          if (res.status === 200 && res.data.products) {
            setItemCount(res.data.products.length);
          } else {
            console.error("An error occurred while fetching cart items");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }
  }, [location.pathname, itemCount, TokenInfo.userId]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchCurrentUser();
    verifyAdmin();
  }, [verifyAdmin, token, fetchCurrentUser]);

  return (
    <div className="fixed top-0 right-0  left-0 bg-black  p-4 z-10 text-white  w-full">
      <div className="mx-auto ">
        <nav className="flex justify-between ">
          <a href="#" className="nav__logo my-auto">
            YOUFit.
          </a>

          <div
            className="my-auto rounded-full bg-gris2 border border-gris4 px-6 w-1/2 py-2"
            id="nav-menu"
          >
            <ul className="flex justify-between  w-full ">
              <li>
                {isAdmin ? (
                  <Link to="/dashboard" className=" text-white ">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/" className=" text-white ">
                    Home
                  </Link>
                )}
              </li>
              <li>
                <Link to="/MealsPlans" className="text-white">
                  Nutrious
                </Link>
              </li>
              <li>
                <Link
                  to={
                    !isAuthenticated || isAdmin
                      ? "/workoutPlans"
                      : "/FworkoutPlans"
                  }
                  className="text-white"
                >
                  Workout
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-white">
                  Store
                </Link>
              </li>
            </ul>

            <i className="bi bi-x nav__close" id="nav-close"></i>
          </div>
          {/* <div>
              <ul className="mt-2">
                <li>
                  <Link
                    to="/login"
                    className="bg-lime-400 px-8  py-2 border  text-black rounded-full "
                    id="log-btn"
                  >
                    Register Now
                  </Link>
                </li>
              </ul>
            </div> */}
          <div className="relative flex gap-4 my-auto">
            <button
              className="group inline-flex mb-2 gap-4 items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              {isAuthenticated ? (
                <>
                  <Avatar
                    alt={currentUserInfo.username}
                    src={`http://localhost:3000/uploads/${currentUserInfo.avatar}`}
                    className=" capitalize"
                  />
                  <h4 className="text-lime-400 font-extrabold capitalize tracking-wide ">
                    {currentUserInfo.username}
                  </h4>
                  <span className="text-gray-100 group-hover:text-gray-300">
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <Avatar alt="" src="" />
                  <Link to="/login">Sign In</Link>
                </>
              )}
            </button>

            {isDropdownOpen && (
              <div className={dropdownClasses}>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400"
                >
                  Profile
                </Link>
                <Link
                  to="/setting"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400"
                >
                  Settings
                </Link>
                <button
                  onClick={Logout}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400"
                >
                  Logout
                </button>
              </div>
            )}
            {((isAuthenticated && location.pathname === "/store") ||
              location.pathname === "/mycart") && (
              <div>
                <Link to="/mycart" className="flex items-center gap-2">
                  <img
                    src="bag.png"
                    alt="Shopping Cart"
                    className="w-10 h-10"
                  />
                  <div className="my-auto">
                    <p className="text-md bg-white rounded-full text-black text-center px-2 py-1">
                      {itemCount}
                    </p>
                    <p className="text-sm">Cart</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
