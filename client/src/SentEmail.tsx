import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNotification } from "./useNotification";
import { Alert } from "@mui/material";

const EmailSentNotification = () => {
  const { setNotification, message, type } = useNotification();
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const handleClick = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/resendEmail`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setNotification(res.data.message, "success");
      } else {
        setNotification("there is something Wrong", "error");
      }
    } catch (error) {
      setNotification("there is something Wrong", "error");
    }
  };
  return (
    <>
      <div className=" fixed w-full">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>
      <div className="flex h-screen justify-center items-center">
        {" "}
        <div
          className="bg-black border-t border-b border-lime-500 text-white px-4 py-3 w-96 h-80 flex flex-col justify-between items-center" // Adjusted flex direction and alignment
          role="alert"
        >
          <div className="flex items-center justify-center">
            <div>
              <div className="flex gap-2 justify-center mt-10 mb-10">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-lime-500 my-auto "
                />
                <p className="font-bold  my-auto text-center ">
                  Check Your Email
                </p>
              </div>
              <p className="text-xl  text-center">
                We have sent you an email with further instructions.
              </p>
            </div>
          </div>
          <div>
            <p className="text-center text-sm mb-4">
              if you didnt receive the email click the button below!
            </p>
            <div className="flex justify-center">
              <button
                className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleClick}
              >
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailSentNotification;
