import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import WorkoutCard from "./WorkoutCard";

import Navbar from "./navbar";
import { useNotification } from "./useNotification";
import { Alert } from "@mui/material";
import { useFilter } from "./useFilter";

// Assume this is the path to your component
interface CardProps {
  _id: string;
  nameOfprogram: string;
  description: string;
  thumbnail_W: string;
  intensity: string;
  category: string;
}

const FetchFiltredWorkout = () => {
  const [workoutPlans, setWorkoutPlans] = useState<CardProps[]>([]);
  const { filter, setFilter } = useFilter();
  const { fetchTokenInfo, fetchCurrentUser, TokenInfo } =
    useContext(UserContext);
  const { verifySession } = useContext(AuthContext);

  const { setNotification, message, type } = useNotification();

  useEffect(() => {
    const init = async () => {
      await fetchTokenInfo();
      await fetchCurrentUser();
      await verifySession();
    };
    init();
  }, [fetchCurrentUser, fetchTokenInfo, verifySession]);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        if (TokenInfo.userId) {
          const response = await axios.get(
            `http://localhost:3000/api/Workout/${TokenInfo.userId}`
          );
          setWorkoutPlans(response.data.workouts);
          if (!response.data.workouts) {
            setNotification(
              response.data.message,
              response.data.type || "info"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching workout plans:", error);

        setNotification("Failed to fetch workouts. Please try again.", "error");
      }
    };

    if (TokenInfo.userId) {
      fetchWorkoutPlans();
    }
  }, [TokenInfo, setNotification]);

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
      <div>
        <div className="mt-20 fixed w-full">
          {message && <Alert severity={type}>{message}</Alert>}
        </div>
        <div className="relative ">
          <Navbar />
        </div>
        <div className=" max-w-5xl mt-28 m-auto">
          <h1 className="home__subtitle ">
            🌟 Welcome to Your Tailored Fitness 🌟 <br />
          </h1>
          <h1 className="text-[4.5rem]">
            {" "}
            <span>Journey! </span>
          </h1>
          <p className="mb-12 text-[#f0f8ff] w-full mt-16 leading-relaxed">
            Dive into a world where fitness meets personalization. Our
            meticulously curated workout plans are designed to cater to every
            individual—regardless of where you stand on your fitness journey.
            Whether you're just setting foot into the realm of exercise, looking
            to push past your current limits, or ready to take on
            professional-grade challenges, we have the perfect plan waiting for
            you. <br /> <br />
            Choose Your Path: We understand that everyone's fitness journey is
            unique. That's why we offer four distinct paths to cater to your
            specific needs and goals: <br /> <br />
          </p>
          <ul className="list-disc markerColor pl-5 space-y-4">
            <li>
              <span className="font-bold">Beginner : </span> New to working out?
              Start here to build a solid foundation with routines that are{" "}
              <br /> as rewarding as they are enjoyable.
            </li>
            <li>
              {" "}
              <span className="font-bold">Intermediate:</span> Ready to step it
              up? These plans will challenge you more while still being <br />{" "}
              accessible and engaging.
            </li>
            <li>
              {" "}
              <span className="font-bold">Advanced :</span> For those who are no
              strangers to fitness and are looking to intensify their regimen.
            </li>
            <li>
              <span className="font-bold">Pro :</span> Designed for the fitness
              aficionado seeking the ultimate challenge and the most intense
              routines.
            </li>
          </ul>
          <p className="mb-12 text-[#f0f8ff] w-full mt-16 leading-relaxed">
            Embark With Confidence: No matter your choice, each program is
            crafted with the same goal in mind—to inspire, challenge, and
            celebrate your progress. Embrace the journey toward a stronger,
            healthier, and more vibrant you. It's time to make fitness a
            thrilling adventure of discovery and achievement. Explore our
            workout plans, pick your path, and let's start crafting your success
            story today!
          </p>
        </div>
        <div className="flex justify-between rounded-full mx-auto mt-24 p-0 text-white bg-gray-500  w-5/12">
          {categories.map((category, index) => (
            <li key={index} className="my-px">
              <button
                onClick={() => handleCategoryClick(category)}
                className=" items-center h-10 px-3 rounded-full hover:bg-gray-950 hover:text-lime-400"
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
              workoutId={workout._id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FetchFiltredWorkout;
