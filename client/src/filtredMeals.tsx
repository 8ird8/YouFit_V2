import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "./cardMeals";
import { UserContext } from "./userContext";
import Navbar from "./navbar";

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

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (TokenInfo.userId) {
        // Only proceed if userId is not empty
        try {
          const res = await axios.get(
            `http://localhost:3000/api/MealsPlans/${TokenInfo.userId}`,
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
  },[fetchTokenInfo]);

  return (
    <div>
      <Navbar/>
      <div className="grid grid-cols-1 p-4 mt-20 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mealPlans.map((plan) => (
        <Card
          key={plan._id}
          Plan_Name={plan.Plan_Name}
          descriptionP={plan.descriptionP}
          thumbnail={`http://localhost:3000/uploads/${plan.thumbnail}`}
          totalCalories={plan.totalCalories}
          planId={plan._id}
        />
      ))}
    </div>
    </div>
  );
};

export default FetchFiltredMealPlans;
