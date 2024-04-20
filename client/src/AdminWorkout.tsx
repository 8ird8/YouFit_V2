import { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import WorkoutCard from "./WorkoutCard";
// import { useNavigate } from "react-router-dom";
import { useFilter } from "./useFilter";
import { Sidebar } from "./sidebar";

// Assume this is the path to your component
interface CardProps {
  _id: string;
  nameOfprogram: string;
  description: string;
  thumbnail_W: string;
  intensity: string;
  category: string;
}

const AdminWorkout = () => {
  const [workoutPlans, setWorkoutPlans] = useState<CardProps[]>([]);
  const { filter, setFilter } = useFilter();
  const { fetchTokenInfo, fetchCurrentUser } = useContext(UserContext);
  const { verifySession } = useContext(AuthContext);

  // const navigate = useNavigate();

  useEffect(() => {
    const AdminWorkout = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/WorkoutPlans"
        );
        setWorkoutPlans(response.data.WorkoutPLan);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      }
    };

    AdminWorkout();
  }, []);

  const filteredWorkout = useMemo(() => {
    return workoutPlans.filter((workoutPlan) => {
      const matchesCategory = filter.category
        ? workoutPlan.category === filter.category.toLocaleLowerCase()
        : true;
      // const matchesSearch = search ? product.product_Name.toLowerCase().includes(search.toLowerCase()) : true;
      return matchesCategory;
    });
  }, [workoutPlans, filter.category]);

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
    verifySession();
  }, [fetchCurrentUser, fetchTokenInfo, verifySession]);

  const categories = ["Beginner", "Middle", "Advanced", "Professional"];

  const handleCategoryClick = (category: string) => {
    setFilter((prev) => ({ ...prev, category }));
  };

  return (
    <>
      <div className="flex ">
        <div className=" w-72">
          <Sidebar />
        </div>

        <div className="w-full ">
          <div className="flex    mx-auto mt-24 p-0 text-white   w-5/12">
            {categories.map((category, index) => (
              <li key={index} className=" bg-gray-500 rounded-full hover:bg-gray-950 hover:text-lime-400 px-4  text-center">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className=" items-center h-10 px-3 rounded-full "
                >
                  <p className="ml-3">{category}</p>
                </button>
              </li>
            ))}
          </div>

          <div className="grid mt-20 p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkout?.map((workout) => (
              <WorkoutCard
                key={workout._id}
                nameOfprogram={workout.nameOfprogram}
                description={workout.description}
                thumbnail={`http://localhost:3000/uploads/${workout.thumbnail_W}`}
                intensity={workout.intensity}
                workoutId={workout._id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminWorkout;
