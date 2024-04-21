import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { Alert } from "@mui/material";
import { useNotification } from "./useNotification";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const icon = visible ? "hide" : "show";
  const icon2 = visible2 ? "hide" : "show";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const { setNotification, message, type } = useNotification();

  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [Message, setMessage] = useState<string | null>(null);

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/register",
        {
          username: username,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          gender: gender,

          // weight: weight,
          // activityLevel: activityLevel,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        // localStorage.setItem("token", res.data.token);
        navigate("/sent");
        // setNotification(res.data.message , res.data.type  || "success");
      }
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setNotification(
          error.response.data.message,
          error.response.data.type || "error"
        );
      } else {
        setNotification("Error during sign-up", "error");
      }
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
      {message && <Alert severity={type}>{message}</Alert>}
      <div className="login-card-container text-black">
        <div className="login-card">
          <div className="login-card-logo">
            <img src="favicon.png" alt="logo" />
            <div>YOUFit.</div>
          </div>
          {/* {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mt-4">
              <strong>{errorMessage}</strong>
            </div>
          )}
          {Message && (
            <div className="bg-green-500 border border-green-600 text-white px-4 py-2 rounded-md mt-4">
              <strong>{Message}</strong> 
            </div>
          )} */}
          <div className="login-card-header">
            <h1>Sign Up</h1>
            <div>Please Sign Up to use the platform</div>
          </div>
          <form onSubmit={handleSumbit} className="login-card-form">
            <div className="form-item">
              <span className="form-item-icon text-black material-symbols-rounded">
                Email
              </span>
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded block w-full appearance-none "
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-item">
              <span className="form-item-icon text-black material-symbols-rounded">
                Username
              </span>
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded   block w-full appearance-none "
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-input rounded-full ">
              <select
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-full  border-none text-gray-400  bg-transparent p-4 border "
              >
                <option className="bg-input text-black" value="">
                  Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                {/* <option value="">Rather Not Say</option> */}
              </select>
            </div>

            <div className="form-item">
              <span className="form-item-icon text-black material-symbols-rounded">
                Password
              </span>
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded  block w-full appearance-none "
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
            <div className="form-item">
              <span className="form-item-icon text-black material-symbols-rounded">
                confirm Password
              </span>
              <div className="relative">
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded  block w-full appearance-none "
                  type={visible2 ? "text" : "password"}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setVisible2(!visible2)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {icon2}
                </button>
              </div>
            </div>
            <div className="form-item-other"></div>
            <button type="submit">Sign Up</button>
          </form>
          <div className="login-card-footer">
            Already have an account ? <Link to="/login">Login.</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
