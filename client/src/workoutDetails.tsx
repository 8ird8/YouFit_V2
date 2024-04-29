import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import WorkoutExCard from "./WorkoutExCard";
import { useAuth } from "./useAuth";
import Navbar from "./navbar";

interface Exercise {
  name_Ex: string;
  description_Ex: string;
  intensity: string;
  videoUrl: string;
  videoFile: string;
  _id: string;
}

interface DailyExercise {
  day: string;
  exercises: Exercise[];
  level: string;
}

interface Props {
  nameOfprogram: string;
  description: string;
  thumbnail_W: string;
  dailyExercises: DailyExercise[];
  _id: string;
}

const WorkoutPlanDetails = () => {
  const [workoutPlan, setWorkoutPlan] = useState<Props | null>(null);
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const { authAdmin } = useAuth();
  const isAdmin = authAdmin && authAdmin.isAdmin;
  

  useEffect(() => {
    const fetchWorkoutPlanDetails = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/WorkoutPlans/${workoutId}`
        );
        setWorkoutPlan(response.data.WorkoutDetail);
      } catch (error) {
        console.error("Error fetching workout plan details:", error);
      }
    };

    fetchWorkoutPlanDetails();
  }, [workoutId]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${BaseUrl}/api/WorkoutPlans/${workoutId}`,
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

  if (!workoutPlan) {
    return (
      <div className="preloader" id="preloader">
        <img src={`${AssetsUrl}/preloader.gif`} />
      </div>
    );
  }

  return (
    <>
     <div >
      <Navbar/>
    </div>
    <div className=" mx-auto p-4   bg-gray-950 text-white">
      <div className="flex px-20 justify-between">
        <button onClick={() => navigate(-1)}>
          <img
            className="w-10 h-10 bg-lime-400 rounded-full p-2"
            src={`${AssetsUrl}/arrowleft.png`}
            alt="arrow-left"
          />
        </button>
        {isAdmin && (
          <div className="my-auto flex gap-2 ">
            <Link
              to={`/workoutPlan/update/${workoutId}`}
              className="  my-auto w-8 h-8 "
            >
              <img src={`${AssetsUrl}/edit.png`} alt="edit" />
            </Link>
            <button onClick={handleDelete} className="  my-auto w-8 h-8">
              <img src={`${AssetsUrl}/trash.png`} alt="trash" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-10">
        <img
          src={`${BaseUrl}/uploads/${workoutPlan.thumbnail_W}`}
          alt="thumbnail"
          className="w-3/4 m-auto  h-thumbnail object-cover"
        />
        <div className="flex rounded-lg bg-yellow-300  p-2 mt-4  text-black gap-4">
          <img src={`${AssetsUrl}/warning.png`} alt="wa" className="w-10 h-10" />
          <p className="my-auto"><strong>!IMPORTANT :</strong> Remumber to warm up Before start any of those exercise.</p>
        </div>
        {/* <h2 className="text-4xl font-semibold mt-4 mb-2">Daily </h2> */}
        <div className="">
          {workoutPlan.dailyExercises.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-4 mt-16">
              <h3 className="  text-5xl mb-2 text-center font-semibold">Day {day.day}</h3>

              <div className="grid p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {day.exercises.map((exercise) => (
                  <WorkoutExCard
                    key={exercise._id}
                    workoutId={workoutPlan._id}
                    videoUrl={exercise.videoUrl}
                    name_Ex={exercise.name_Ex}
                    description_Ex={exercise.description_Ex}
                    intensity={exercise.intensity}
                    exerciseId={exercise._id}
                    dayIndex={dayIndex}
                    IsAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>    
  );
};

export default WorkoutPlanDetails;
