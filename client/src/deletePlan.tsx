import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./useNotification";

interface DeleteButtonProps {
  planId: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ planId }) => {
  const navigate = useNavigate();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const { setNotification } = useNotification();

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Plan?"
    );
    if (isConfirmed) {
      try {
        const res = await axios.delete(
          `http://localhost:3000/api/MealsPlan/${planId}`,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          console.log("delleted successfully");
          setNotification(res.data.message, res.data.type);
          navigate("/home");
        } else {
          // setNotification("You are not allowed to delete this post");
          console.error("You are not allowed");
          navigate("/home");
        }
      } catch (error) {
        console.log(" u D'ONT HAVE THE ACCES :", error);
        // Handle error or show a notification to the user
      }
    }
  };

  return (
    <button onClick={handleDelete}>
      <img src={`${AssetsUrl}/trash.png`} alt="trash" className="w-8 h-8" />
    </button>
  );
};

export default DeleteButton;
