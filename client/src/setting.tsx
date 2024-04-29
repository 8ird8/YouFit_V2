import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./userContext";
import Navbar from "./navbar";
import { useNotification } from "./useNotification";
import { Alert } from "@mui/material";
import Footer from "./footer";

const Setting = () => {
  const { fetchTokenInfo, TokenInfo, currentUserInfo, fetchCurrentUser } =
    useContext(UserContext);
  const [username, setUsername] = useState(currentUserInfo.username || "");
  const [email, setEmail] = useState(currentUserInfo.email || "");
  const [gender, setGender] = useState(currentUserInfo.gender || "");
  const [weight, setWeight] = useState(currentUserInfo.weight || "");
  const [goal, setGoal] = useState(currentUserInfo.goal || "goal");
  const { setNotification, message, type } = useNotification();
  const [OldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  //   const [Message, setMessage] = useState<string | null>(null);
  //   const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const Navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("OldPassword", OldPassword);
    formData.append("NewPassword", NewPassword);
    formData.append("ConfrimPassword", ConfirmPassword);
    formData.append("gender", gender);
    formData.append("goal", goal);
    formData.append("weight", weight);
    if (fileInputRef.current?.files) {
      formData.append("avatar", fileInputRef.current.files[0]);
    }

    try {
      const res = await axios.put(
        `${BaseUrl}/api/user/update/${TokenInfo.userId}`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setNotification("User updated successfully", "success");

        Navigate("/profile");
      } else {
        setNotification("Error updating user", "error");
      }
    } catch (error) {
      console.error("Error during user update:", error);
      setNotification("Error during user update", "error");
    }
  };

  const handleSubmitPass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Construct JSON object
    const data = {
      OldPassword: OldPassword,
      NewPassword: NewPassword,
      ConfirmPassword: ConfirmPassword,
    };

    try {
      const res = await axios.put(
        `${BaseUrl}/api/user/update/password/${TokenInfo.userId}`,
        data, // Send JSON data directly
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Ensure you set the content type to application/json
          },
        }
      );

      if (res.status === 200) {
        setNotification("Password updated successfully", "success");
        Navigate("/profile");
      } else {
        setNotification("Error updating user", "error");
      }
    } catch (error) {
      console.error("Error during user update:", error);
      setNotification("Error during user update", "error");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchCurrentUser, fetchTokenInfo]);

  return (
    <div className="">
      <button className="px-52 py-4" onClick={() => navigate(-1)}>
        <img
          className="w-10 h-10 mt-20 bg-lime-400 rounded-full p-2"
          src={`${AssetsUrl}/arrowleft.png`}
          alt="arrow-left"
        />
      </button>
      <div className="mt-20 fixed w-full">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>
      <div className=" ">
        <Navbar />
      </div>
      <div className="  m-auto w-full flex flex-col gap-5 px-3 md:px-1  md:flex-row text-[#161931]">
        <main className="w-full  m-auto min-h-screen py-1 md:w-9/12 ">
          <div className="p-2 md:p-4">
            <div className="w-full border   shadow-lg py-6 px-6 pb-8 mt-8  sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">User Info</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid max-w-4xl mx-auto mt-1">
                  <div className="items-center mt-6 sm:mt-14 text-[#202142]">
                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-2">
                      <div className="w-full">
                        <label className=" mb-4 text-sm font-medium text-gray-300 ">
                          Username :
                        </label>
                        <input
                          type="text"
                          id="username"
                          className="bg-lime-50 border text-black border-lime-300 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-2 sm:mb-2">
                      <label className="block mb-2 text-sm font-medium text-gray-300 ">
                        Email :
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="bg-lime-50 border text-black border-lime-300  text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-2  sm:mb-2">
                      <label className="block mb-2 text-sm  font-medium text-gray-300 ">
                        Gender :
                      </label>
                       <select
                          onChange={(e) => setGender(e.target.value)}
                          className="bg-lime-50 border text-black border-lime-300 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        >
                          <option className="bg-input text-black" value={gender}>
                            {gender}
                          </option>
  
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          {/* <option value="">Rather Not Say</option> */}
                        </select>
                    </div>
                    <div className="mb-2 sm:mb-2">
                      <label className="block mb-2 text-sm font-medium text-gray-300 ">
                        Goal :
                      </label>
                      <input
                        type="text"
                        className="bg-lime-50 border text-black border-lime-300  text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        onChange={(e) => setGoal(e.target.value)}
                        value={goal}
                      />
                    </div>
                    <div className="mb-2 sm:mb-2">
                      <label className="block mb-2 text-sm font-medium text-gray-300 ">
                        Weight :
                      </label>
                      <input
                        type="number"
                        className="bg-lime-50 border text-black border-lime-300 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        onChange={(e) => setWeight(e.target.value)}
                        value={weight}
                      />
                    </div>

                    <label className="flex items-center mb-4 mt-6 cursor-pointer text-blue-600 hover:text-blue-800">
                      <span className="mr-2 ml-2 mt-2 text-gray-300 font-semibold ">
                        Avatar
                      </span>
                      <img  src={`${AssetsUrl}/upload.png`} alt="image" className="w-8 h-8" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png, image/gif"
                        id="image"
                        name="imageUrl"
                        ref={fileInputRef}
                      />
                    </label>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="text-white bg-lime-700  hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="w-full border  shadow-lg py-6 px-6 pb-8 mt-8 mb-6  sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                User Password
              </h2>

              <form onSubmit={handleSubmitPass}>
                <div className="grid max-w-4xl mx-auto mt-1">
                  <div className="items-center mt-6 sm:mt-14 text-[#202142]">
                    <div className="mb-2 sm:mb-">
                      <label className="block mb-2 text-sm font-medium text-gray-300 ">
                        Old Password :
                      </label>
                      <input
                        type="password"
                        className="bg-lime-50 border border-lime-300  text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        placeholder="Old password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2 sm:mb-">
                      <label className="block mb-2 text-sm font-medium text-gray-300 ">
                        New Password :
                      </label>
                      <input
                        type="password"
                        className="bg-lime-50 border border-lime-300  text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        placeholder="New password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-8 sm:mb-">
                      <label className="block mb-2 text-sm font-medium text-gray-300 ">
                        Confirm Password :
                      </label>
                      <input
                        type="password"
                        className="bg-lime-50 border border-lime-300  text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 "
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="text-white bg-lime-700  hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Setting;
