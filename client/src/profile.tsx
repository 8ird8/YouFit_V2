import { useContext, useEffect, useRef } from "react";
import { UserContext } from "./userContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import { Alert, Avatar } from "@mui/material";
import { useNotification } from "./useNotification";
import Footer from "./footer";

const Profile = () => {
  const { currentUserInfo, TokenInfo, fetchTokenInfo, fetchCurrentUser } =
    useContext(UserContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { message, type } = useNotification();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchCurrentUser, currentUserInfo, fetchTokenInfo]);

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if (file) {
      formData.append("avatar", file);

      try {
        const res = await axios.put(
          `${baseUrl}/api/user/update/${TokenInfo.userId}`,
          formData,
          { withCredentials: true }
        );

        if (res.status === 200) {
          fetchCurrentUser();
        } else {
          console.error("Error updating user");
        }
      } catch (error) {
        console.error("Error during user update:", error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className=" justify-between">
      <div className="mt-20 fixed w-full">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>
      <div className=" ">
        <Navbar />
      </div>

      <div className=" mt- w-full  flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <main className=" min-h-screen border mx-auto py-1 md:w-2/3 lg:w-3/4">
          <div className="p-2 md:p-4">
            <div className="flex  m-auto justify-center gap-x-10 gap-y-4">
              <div className="w-full  pb-8  p-4 mt-8 sm:max-w-xl sm:rounded-lg">
                <div className="grid max-w-2xl mx-auto mt-8">
                  <div className="flex-row  items-center  sm:flex-row ">
                    <div className="mb-16 ">
                      <div className="relative">
                        {/* <img
                          className="object-cover m-auto w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                          src={`${baseUrl}/public/${currentUserInfo.avatar}`}
                          alt="Bordered avatar"
                        /> */}
                        <Avatar
                          className="object-cover m-auto   rounded-full    ring-4 ring-lime-300 dark:ring-lime-500"
                          alt={currentUserInfo?.username}
                          src={`${baseUrl}/uploads/${currentUserInfo.avatar}`}
                          style={{ width: "150px", height: "150px" }}
                        />
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-3  bg-lime-400  p-2 rounded-full"
                          style={{
                            transform: "translate(50%, 50%)",
                            right: "42%",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-pencil-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.647a.5.5 0 0 0 0-.707l-2-2a.5.5 0 0 0-.707-.707l-.293.293ZM10 2.207 2 10.207v.586l-.5.5v2.5h2.5l.5-.5h.586L13.793 6l-3.793-3.793ZM1 13.5V11l.5-.5h2.5l.5.5v2.5H2l-.5-.5v-2.086l-.5.5v.586Z" />
                          </svg>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </button>
                      </div>
                      <h2 className="pl-6 text-3xl text-center  capitalize mt-4  font-bold sm:text-2xl">
                        {currentUserInfo.username}
                      </h2>
                    </div>

                    <h2 className="mb-2 mt-4 text-md text-xl capitalize font-bold text-gray-300">
                      Email :
                    </h2>
                    <div className="bg-lime-50 border border-lime-300 text-lime-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 ">
                      <p>{currentUserInfo.email}</p>
                    </div>
                    <h2 className="mb-2 mt-4 text-md text-xl capitalize  font-bold text-gray-300">
                      Gender :
                    </h2>
                    <div className="bg-lime-50 border border-lime-300 h-10 text-lime-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 ">
                      <p>{currentUserInfo.gender}</p>
                    </div>
                    <h2 className="mb-2 mt-4 text-md text-xl capitalize font-bold text-gray-300">
                      Weight :
                    </h2>
                    <div className="bg-lime-50 border border-lime-300 text-lime-900 text-sm rounded-lg focus:ring-lime-500 focus:border-indigo-500 block w-full p-2.5 ">
                      <p>
                        {currentUserInfo.weight ? currentUserInfo.weight : ""}{" "}
                        kg
                      </p>
                    </div>
                    <h2 className="mb-2 mt-4 text-md text-xl capitalize font-bold text-gray-300">
                      Level :
                    </h2>
                    <div className="bg-lime-50 border capitalize border-lime-300 text-lime-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 ">
                      <p>{currentUserInfo.level}</p>
                    </div>
                    <h2 className="mb-2 mt-4 text-md text-xl capitalize font-bold text-gray-300">
                      Goal :
                    </h2>
                    <div className="bg-lime-50 border capitalize border-lime-300 text-lime-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 ">
                      <p>{currentUserInfo.goal}</p>
                    </div>
                  </div>

                  <Link to="/setting" className="flex justify-end">
                    <button
                      type="button"
                      className="py-2 mt-6 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
