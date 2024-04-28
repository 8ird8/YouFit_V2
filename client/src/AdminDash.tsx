// AdminDash.tsx
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
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;

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
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    verifyAdmin();
  }, [verifyAdmin, fetchCurrentUser]);

  const handleDelete = async (userId: string) => {
    try {
      const res = await axios.delete(`${BaseUrl}/api/users/${userId}`);
      if (res.status === 200) {
        setNotification("User deleted successfully", "success");
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error("Error during user delete:", error);
      setNotification("Error during user delete", "error");
    }
  };

  // const handleSubmit = async (
  //   e: React.FormEvent<HTMLFormElement>,
  //   userId: string,
  //   newRole: string
  // ) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.put(
  //       `${BaseUrl}/api/user/update/role/${userId}`,
  //       { role: newRole },
  //       { withCredentials: true }
  //     );

  //     if (res.status === 200) {
  //       setNotification("Role updated successfully", "success");
  //       setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
  //     } else {
  //       setNotification(res.data.message || "An unexpected error occurred", "error");
  //     }
  //   } catch (error: any) {
  //     setNotification(
  //       error.response?.data.message || "An error occurred while updating role",
  //       "error"
  //     );
  //   }
  // };

  return (
    <main className="flex h-screen justify-between">
      <div className="fixed w-full z-20">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>
      <Sidebar />
      <div className="w-80"></div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full">
          <thead className="whitespace-nowrap">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Avatar</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {users.map((user) => (
              <tr className="border" key={user._id}>
                <td className="px-6 py-3 text-sm">
                  <Avatar
                    alt={user.username}
                    src={`${BaseUrl}/uploads/${user.avatar}`}
                    className="capitalize"
                  />
                </td>
                <td className="px-6 py-3 text-sm">{user.username}</td>
                <td className="px-6 py-3 text-sm">{user.email}</td>
                <td className="p-3 px-5">
                  {/* <form onSubmit={(e) => handleSubmit(e, user._id, user.role)}>
                    <select
                      value={user.role}
                      className="bg-transparent border-b-2 border-gray-300 py-2"
                      onChange={(e) => { user.role = e.target.value; }}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button type="submit" className="ml-4" title="Save">Save</button>
                  </form> */}
                  <p>{user.role}</p>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="mr-4"
                    title="Delete"
                  >
                    <img src={`${AssetsUrl}/trash.png`} alt="trash" className="w-8 h-8 " />
                    
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
