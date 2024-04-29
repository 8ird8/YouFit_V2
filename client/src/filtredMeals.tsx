import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "./cardMeals";
import { UserContext } from "./userContext";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer";

interface CardProps {
  _id: string;
  Plan_Name: string;
  descriptionP: string;
  thumbnail: string;
  totalCalories: number;
}

const FetchFiltredMealPlans = () => {
  const [mealPlans, setMealPlans] = useState<CardProps[]>([]);
  const { TokenInfo, fetchTokenInfo } = useContext(UserContext);
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (TokenInfo.userId) {
        try {
          const res = await axios.get(
            `${BaseUrl}/api/MealsPlans/${TokenInfo.userId}`,
            {
              withCredentials: true,
            }
          );

          if (res.status === 200) {
            setMealPlans(res.data.Meals);
          } else {
            console.error("Error fetching?");
          }
        } catch (error) {
          console.error("Error fetching meal plans:", error);
        }
      }
    };

    fetchMealPlans();
  }, [TokenInfo.userId]);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  return (
    <div>
      <Navbar />
      <button className="px-10" onClick={() => navigate(-1)}>
        <img
          className="w-10 h-10 mt-24  bg-lime-400 rounded-full p-2"
          src={`${AssetsUrl}/arrowleft.png`}
          alt="arrow-left"
        />
      </button>
      {mealPlans.length > 0 ? (
        <div className="grid grid-cols-1 p-4 mt-20 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mealPlans.map((plan) => (
            <Card
              key={plan._id}
              Plan_Name={plan.Plan_Name}
              descriptionP={plan.descriptionP}
              thumbnail={`${BaseUrl}/uploads/${plan.thumbnail}`}
              totalCalories={plan.totalCalories}
              planId={plan._id}
            />
          ))}
        </div>
      ) : (
        <>
          <h1 className="mt-20">No Meal Plan found for you Sorry!</h1>
          <h2 className="text-center">But you can check Other Plans</h2>
          <div className="flex justify-center mt-10">
            <Link
              to="/MealsPLans"
              className="px-6 py-2 bg-lime-400 text-black font-bold rounded-full"
            >
              {" "}
              PLAN
            </Link>
          </div>
        </>
      )}
      <div className= "mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default FetchFiltredMealPlans;
