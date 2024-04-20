import { Link, useNavigate } from "react-router-dom";
import "./assets/output.css";
import { useNotification } from "./useNotification";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import { Alert } from "@mui/material";

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { fetchCurrentUser, fetchTokenInfo } = useContext(UserContext);
  const { authStatus, authAdmin } = useContext(AuthContext);
  const { verifySession, verifyAdmin } = useContext(AuthContext);
  const { setNotification, message, type } = useNotification();
  // const isAdmin = authAdmin && authAdmin.isAdmin;
  const token = localStorage.getItem("token");

  const icon = visible ? "show" : "hide";

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
    verifySession();
    verifyAdmin();
  }, [fetchCurrentUser, token, fetchTokenInfo, verifyAdmin, verifySession]);

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // Check the response status and handle accordingly
      if (res.status === 200) {
        console.log(res.data.token);

        localStorage.setItem("token", res.data.token || null);
        await verifySession();
        await verifyAdmin();
        await fetchTokenInfo();
        await fetchCurrentUser();
        console.log(authStatus);
        if (authStatus.checked && authAdmin.checked) {
          if (res.data.data.role === "Admins") {
            navigate("/dashboard");
            console.log(authAdmin);
            console.log(res.data.data.role);
            setNotification(res.data.message, "success");
          } else {
            navigate("/MealsPlans");
            setNotification(res.data.message, "success");
            console.log(res.data.data.role);
          }
        } else {
          return;
        }
      } else {
        setNotification(
          res.data.message || "An error occurred",
          res.data.type || "error"
        );
      }
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      setNotification(
        error.response?.data.message || "An error occurred",
        error.response?.data.type || "error"
      );
    }
  };

  // const handleSignIn = async () => {

  //   window.location.href = "http://localhost:3000/api/auth/google";
  // };

  const togglePass = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className="fixed w-full">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>
      <div className="login-card-container">
        <div className="login-card">
          <div className="login-card-logo">
            <img src="favicon.png" alt="logo" />
            <div>YOUFit.</div>
          </div>
          {/* {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mt-4">
              <strong>{errorMessage}</strong>
            </div>
          )} */}
          <div className="login-card-header">
            <h1>Sign In</h1>
            <div>Please login to use the platform</div>
          </div>
          <form onSubmit={handleSumbit} className="login-card-form">
            <div className="form-item">
              <span className="form-item-icon text-gray-700 material-symbols-rounded">
                Email
              </span>
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none pr-10"
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  id="emailForm"
                  required
                />
              </div>
            </div>
            <div className="form-item">
              <span className="form-item-icon text-gray-700 material-symbols-rounded">
                lock
              </span>
              {/* <input type="password" placeholder="Enter Password" id="passwordForm"
                    required/> */}
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none pr-10"
                  type={visible ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePass}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {icon}
                </button>
              </div>
            </div>
            <div className="form-item-other">
              {/* <div className="checkbox">
                <input type="checkbox" id="rememberMeCheckbox"  />
                <label>Remember me</label>
              </div> */}
              <a href="#">I forgot my password!</a>
            </div>
            <button type="submit">Sign In</button>
          </form>
          <div className="login-card-footer">
            Don't have an account?{" "}
            <Link to="/register">Create a free account.</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
