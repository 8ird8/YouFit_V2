import { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}
interface NotificationContextType {
  message: string;
  type: "success" | "error" | "warning" | "info"; // You can add more types as needed
  setNotification: (
    msg: string,
    type: "success" | "error" | "warning" | "info"
  ) => void;
}

const Context: NotificationContextType = {
  message: "",
  type: "info", // Default type
  setNotification: () => {},
};
export const NotificationContext =
  createContext<NotificationContextType>(Context);

export const NotificationProvider = ({ children }: Props) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "warning" | "info">(
    "info"
  );

  const setNotification = (
    msg: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setMessage(msg);
    setType(type);
    setTimeout(() => {
      setMessage("");
      setType("info"); // Reset to default type
    }, 5000); // Clear message after 5 seconds
  };

  return (
    <NotificationContext.Provider value={{ message, type, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
