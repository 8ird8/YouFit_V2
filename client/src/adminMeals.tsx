import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "./cardMeals";
import { AuthContext } from "./authContext";

import { Sidebar } from "./sidebar";


interface CardProps {
  _id: string;
  Plan_Name: string;
  descriptionP: string;
  thumbnail: string;
  totalCalories: number;
}

const AdminMeals = () => {
  const [mealPlans, setMealPlans] = useState<CardProps[]>([]);
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  const { verifySession } = useContext(AuthContext);

  useEffect(() => {
    const AdminMeals = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/MealPlans`);
        setMealPlans(response.data.Meals);
        // console.log("role", currentUserInfo.role)
        // console.log("user", TokenInfo.userId)
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      }
    };

    AdminMeals();
  }, []);

  useEffect(() => {
    // fetchCurrentUser();
    // fetchTokenInfo();
    verifySession();
  }, [verifySession]);

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Sidebar />
        </div>
        <div className="w-72"></div>
        <div className="m-auto  ml-64"> 
          <h1 className="text-[4.5rem]  font-bold  leading-none ">
            Meals Plans
          </h1>
          <div className="grid p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealPlans?.map((plan) => (
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
        </div>
      </div>
    </>
  );
};

export default AdminMeals;
