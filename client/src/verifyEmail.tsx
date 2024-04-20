import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "./useNotification";

const VerfyEmail = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const { setNotification } = useNotification();
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/${userId}/verify/${token}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          navigate("/login");
          setNotification(res.data.message, res.data.type || "success");

        } else {
          console.error(
            "An error occurred while verifiying your email address"
          );
        }
      } catch (error) {
        console.error("Error verifiying your email address:", error);
      }
    };
    verifyEmail();
  }, [userId, token]);
  return (
    <div className="flex justify-center items-center h-screen">
      {" "}
      verifiying in procces...
    </div>
  );
};

export default VerfyEmail;
