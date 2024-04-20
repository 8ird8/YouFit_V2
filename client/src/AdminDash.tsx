import { useContext, useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import axios from "axios";
import { Alert, Avatar } from "@mui/material";
import { useNotification } from "./useNotification";
interface User {
  username: string;
  email: string;
  role: string;
  avatar: string;
  _id: string;
}

const AdminDash = () => {
  const { verifyAdmin } = useContext(AuthContext);
  const { fetchCurrentUser } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const { setNotification, message, type } = useNotification();
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/users`);

        setUsers(response.data.Users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [users]);

  useEffect(() => {
    fetchCurrentUser();
    verifyAdmin();
  }, [verifyAdmin, fetchCurrentUser]);

  const handledelete = async (userId: string) => {
    try {
      const res = await axios.delete(`${BaseUrl}/api/users/${userId}`);
      if (res.status === 200) {
        setNotification("User deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error during user delete:", error);
      setNotification("Error during user delete", "error");
    }
  };

  return (
    <main className=" flex h-screen  justify-between">
      <div className="fixed w-full z-20">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>
      <Sidebar />
      <div className="w-80"></div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full  ">
          <thead className="whitespace-nowrap">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Avatar
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {users.map((user, index) => (
              <tr className="border" key={user._id || index}>
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <Avatar
                      alt={user.username}
                      src={`http://localhost:3000/uploads/${user.avatar}`}
                      className=" capitalize"
                    />
                    <div className="ml-4"></div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <div className="ml-4">
                      <p className="text-sm text-white">{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <div className="ml-4">
                      <p className="text-sm text-white">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3 px-5">
                  {/* <select
                    value={user.role}
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="Users">User</option>
                    <option value="Admins">Admin</option>
                  </select> */}
                  <p>{user.role}</p>
                </td>

                <td className="px-6 py-3">
                  <button className="mr-4" title="Edit">
                    save
                  </button>
                  <button
                    onClick={() => handledelete(user._id)}
                    className="mr-4"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 fill-red-500 hover:fill-red-700"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                        data-original="#000000"
                      />
                      <path
                        d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                        data-original="#000000"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminDash;
