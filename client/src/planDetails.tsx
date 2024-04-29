import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import DeleteButton from "./deletePlan";
import { useAuth } from "./useAuth";
import Footer from "./footer";

interface Meal {
  title: string;
  description: string;
  protein: string;
  carbs: string;
  fats: string;
}

interface DailyMeal {
  day: string;
  meals: Meal[];
  calories: number;
}

interface Props {
  title: string;
  descriptionP: string;
  Plan_Name: string;
  thumbnail: string;
  totalCalories: number;
  dailyMeals: DailyMeal[];
  _id: string;
}

const MealPlanDetails = () => {
  const [mealPlan, setMealPlan] = useState<Props | null>(null);
  const { planId } = useParams();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const { authAdmin } = useAuth();
  const isAdmin = authAdmin && authAdmin.isAdmin;
  const navigate = useNavigate();
  const BaseUrl = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    const fetchMealPlanDetails = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/MealPlan/${planId}`
        );
        setMealPlan(response.data.PlanDetail);
      } catch (error) {
        console.error("Error fetching meal plan details:", error);
      }
    };

    fetchMealPlanDetails();
  }, [planId ,BaseUrl]);

  if (!mealPlan) {
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
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between">
        <button onClick={() => navigate(-1)}>
          <img
            className="w-10 h-10 bg-lime-400 rounded-full p-2"
            src={`${AssetsUrl}/arrowleft.png`}
            alt="arrow-left"
          />
        </button>
        {isAdmin && (
          <div className="my-auto flex gap-2 ">
            <button
              className=" w-8 h-8  text-black rounded-md "
              onClick={() => navigate(`/MealsPlans/update/${mealPlan._id}`)}
            >
              <img src={`${AssetsUrl}/edit.png`} alt="" />
            </button>
            <DeleteButton planId={mealPlan._id} />
          </div>
        )}
      </div>
      <h1 className="text-5xl mt-10 font-bold mb-4">{mealPlan.Plan_Name}</h1>
      <img
        src={`${BaseUrl}/uploads/${mealPlan.thumbnail}`}
        alt="thumbnail"
      />
      <hr className="text-white" />
      <div className="  mt-10">
        <h2 className="text-4xl text-center font-semibold mt-4 mb-2">
          Daily Meals
        </h2>
        <div className="mx-auto flex justify-center">
          <p className="text-white  leading-8">
            Ils disent que nous sommes ce que nous mangeons. 
            Jamais un mot plus vrai n’a été prononcé et vous pouvez <br />{" "}
            regarder autour de vous et dire à peu près qui mange bien et qui ne
            mange pas. <br /> Je regarde la société d’aujourd’hui et je vois
            l’obésité tout autour de moi, des enfants jusqu’aux adultes. <br />{" "}
            Les émissions de télé-réalité font toutes leur apparition avec des
            émissions comme The Biggest Loser, <br /> Jillian Michael’s Losing
            It et des émissions spéciales sur l’obésité et le diabète.
          </p>
        </div>
        {mealPlan.dailyMeals.map((day, index) => (
          <div
            key={index}
            className="mt-6 border items-center  p-4 border-gray-800 mb-4"
          >
            <div className="section__titles">
              <h1 className="section__title-border">DAY</h1>
              <h1 className="section__title">{day.day}</h1>
            </div>

            {day.meals.map((meal, mealIndex) => (
              <React.Fragment key={`${index}-${mealIndex}`}>
                <div className="program__card   mt-2">
                  <h2 className="program__title "> {meal.title}</h2>
                  <p className="program__description">{meal.description}</p>
                  <div className="text-sm pro font-bold text-white">
                    Protein : {meal.protein} g
                  </div>
                  <div className="text-sm pro font-bold text-white">
                    Carbs : {meal.carbs} g
                  </div>
                  <div className="text-sm pro font-bold text-white">
                    Fats : {meal.fats} g
                  </div>
                </div>
                {/* <div className="text-2xl mb-4 mt-4 font-semibold">
                  {meal.title}
                </div>
                <ul className="list-disc">
                  <li className="ml-8">
                    <p>{meal.description}</p>
                  </li>
                </ul> */}
              </React.Fragment>
            ))}
            <div className="text-2xl mb-4 mt-4 font-semibold">
              Day Calories : {day.calories}
            </div>
          </div>
        ))}
      </div>
      
    </div>
    <Footer/>
    </>
  );
};

export default MealPlanDetails;
