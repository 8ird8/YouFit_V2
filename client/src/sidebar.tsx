import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const Logout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div id="sidebar">
        <div className="sidebar-header">
          <h3 className="">
            <a href="#" className="nav__logo my-auto">
              YOUFit.
            </a>
          </h3>
          <h2 className="text-4xl text-center mt-16">Admin</h2>
        </div>
        <ul className="list-unstyled  components m-0">
          <li
            className={`${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            <Link to="/dashboard" className="dashboard">
              <div className="flex gap-4">
                <img
                  src={`${AssetsUrl}/user-mn.png`}
                  alt=""
                  className="w-8 h-8"
                />
                Users
              </div>
            </Link>
          </li>
          <li
            className={`${
              location.pathname === "/Admin/MealsPlan" ? "active" : ""
            }`}
          >
            <Link to="/Admin/MealsPlan" className=" inline-flex">
              <div className="flex gap-4">
                <img src={`${AssetsUrl}/meal.png`} alt="" className="w-8 h-8" />
                Meals
              </div>
            </Link>
            <ul>
              {" "}
              <li
                className={`${
                  location.pathname === "/add/MealsPlan" ? "active" : ""
                }`}
              >
                {" "}
                <Link to="/add/MealsPlan">
                  <div className="flex gap-4">
                    <img
                      src={`${AssetsUrl}/add-meal.png`}
                      alt=""
                      className="w-8 h-8"
                    />
                    Add Meals
                  </div>
                </Link>
              </li>
            </ul>{" "}
          </li>
          <li
            className={`${
              location.pathname === "/Admin/WorkoutPlan" ? "active" : ""
            }`}
          >
            <Link to="/Admin/WorkoutPlan">
              <div className="flex gap-4">
                <img
                  src={`${AssetsUrl}/heart.png`}
                  alt=""
                  className="w-8 h-8"
                />
                Workouts
              </div>
            </Link>
          </li>

          <li
            className={`${
              location.pathname === "/add/workoutPlan" ? "active" : ""
            }`}
          >
            <Link to="/add/workoutPlan">
              <div className="flex gap-4">
                <img
                  src={`${AssetsUrl}/add-workout.png`}
                  alt=""
                  className="w-8 h-8"
                />
                Add Workout
              </div>
            </Link>
          </li>
          <li
            className={`${
              location.pathname === "/Admin/Store" ? "active" : ""
            }`}
          >
            <Link to="/Admin/Store">
              <div className="flex gap-4">
                <img
                  src={`${AssetsUrl}/store.png`}
                  alt=""
                  className="w-8 h-8"
                />
                Store
              </div>
            </Link>
          </li>
          <li
            className={`${
              location.pathname === "/add/Product" ? "active" : ""
            }`}
          >
            <Link to="/add/Product">
              <div className="flex gap-4">
                <img
                  src={`${AssetsUrl}/add-store.png`}
                  alt=""
                  className="w-8 h-8"
                />
                Add Product
              </div>
            </Link>
          </li>
          <li
            className={`${location.pathname === "/MealsPlans" ? "active" : ""}`}
          >
            <Link to="/MealsPlans">
              <div className="flex gap-4">
                <img src={`${AssetsUrl}/view.png`} alt="" className="w-8 h-8" />
                User View
              </div>
            </Link>
          </li>
          <div className="relative left-6 top-48">
            <button onClick={Logout} className="">
              Logout
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};
