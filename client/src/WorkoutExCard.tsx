import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface CardProps {
  name_Ex: string;
  description_Ex: string;
  videoUrl: string;
  intensity: string;
  workoutId: string;
  dayIndex: number;
  exerciseId: string;
  IsAdmin: boolean;
}

const WorkoutExCard: React.FC<CardProps> = ({
  name_Ex,
  description_Ex,
  intensity,
  videoUrl,
  workoutId,
  dayIndex,
  exerciseId,
  IsAdmin,
}) => {
  const navigate = useNavigate();
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  const handleExDelete = async (dayIndex: number, exersiseId: string) => {
    try {
      const res = await axios.delete(
        `${BaseUrl}/api/WorkoutPlans/${workoutId}/day/${dayIndex}/exersise/${exersiseId}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log("delleted successfully");
        navigate("/workoutPlans");
        // setNotification("Post deleted successfully");
      } else {
        // setNotification("You are not allowed to delete this post");
        console.error("You are not allowed");
      }
    } catch (error) {
      console.log(" u D'ONT HAVE THE ACCES :", error);
      // Handle error or show a notification to the user
    }
  };
  return (
    <div className="card bg-gray-800 border  border-gray-900 p-2 shadow-xl">
      <Link to={`/plan/${workoutId}`}>
        <figure>
          {videoUrl ? (
            <iframe
              width="100%"
              height="400"
              src={videoUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            ""
          )}
        </figure>
        <div className="card-body mt-4 ">
          <div className="flex justify-between">
            <h2 className="text-3xl mb-4 font-bold">{name_Ex}</h2>
            {IsAdmin ? (
              <button
                type="button"
                onClick={() => handleExDelete(dayIndex, exerciseId)}
                className="bg-red-500 px-6 py-2 text-white h-10 my-auto"
              >
                Delete
              </button>
            ) : (
              ""
            )}
          </div>
          <p className=" whitespace-pre-wrap">{description_Ex}</p>
          <div className="flex justify-end">
            <div className=" bg-red-400 w-30  inline-block px-3 font-semibold py-1 rounded-2xl">
              {intensity}
            </div>
          </div>
          <div className="card-actions justify-end">
            {/* Link or button to view more details */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WorkoutExCard;
