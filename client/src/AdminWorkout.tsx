import { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import WorkoutCard from "./WorkoutCard";
// import { useNavigate } from "react-router-dom";
import { useFilter } from "./useFilter";
import { Sidebar } from "./sidebar";
import { Link } from "react-router-dom";

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
  const [search, setSearch] = useState("");
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  // const navigate = useNavigate();

  useEffect(() => {
    const AdminWorkout = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/WorkoutPlans`
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
      const matchesSearch = search
        ? workoutPlan.nameOfprogram.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [workoutPlans, search, filter.category]);

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
    verifySession();
  }, [fetchCurrentUser, fetchTokenInfo, verifySession]);

  const categories = ["Beginner", "Middle", "Advanced", "Professional"];

  const handleCategoryClick = (category: string) => {
    setFilter((prev) => ({ ...prev, category }));
  };
  const resetFilter = async () => {
    setFilter({ category: "" });
  };

  return (
    <>
      <div className="flex ">
        <div className=" w-80">
          <Sidebar />
        </div>

        <div className="w-full ">
          <div className="flex p-4 ">
            <div className="group z-10  border relative">
              <button className="bg-black border w-full font-semibold py-2 px-4  inline-flex items-center">
                <span>Select Category</span>
                <svg
                  className="ml-2 w-4 h-4 bg-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute hidden w-full text-white pt-1 group-hover:block">
                <div className="bg-black rounded shadow-lg">
                  <Link
                    to="/WorkoutPlans"
                    className=" bg-black w-full text-center hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                    onClick={resetFilter}
                  >
                    All
                  </Link>
                  <button
                    className=" bg-black w-full hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                    onClick={resetFilter}
                  >
                    All levels
                  </button>
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="w-full bg-black  hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="  md:flex border w-1/2  relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                id="search"
                type="text"
                name="search"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-indigo-400"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid mt-2 p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkout?.map((workout) => (
              <WorkoutCard
                key={workout._id}
                nameOfprogram={workout.nameOfprogram}
                description={workout.description}
                thumbnail={`${BaseUrl}/uploads/${workout.thumbnail_W}`}
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
