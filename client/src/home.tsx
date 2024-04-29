import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "./cardMeals";
import { AuthContext } from "./authContext";
import { UserContext } from "./userContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";

import { useNotification } from "./useNotification";
import { Alert } from "@mui/material";
import { useAuth } from "./useAuth";
import Footer from "./footer";

// Assume this is the path to your component
interface CardProps {
  _id: string;
  Plan_Name: string;
  descriptionP: string;
  thumbnail: string;
  totalCalories: number;
}

const FetchMealPlans = () => {
  const [mealPlans, setMealPlans] = useState<CardProps[]>([]);
 const { currentUserInfo, TokenInfo, fetchTokenInfo, fetchCurrentUser } =
    useContext(UserContext);
  const { verifySession } = useContext(AuthContext);
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const navigate = useNavigate();
  const { setNotification, message, type } = useNotification();
  const { authStatus } = useAuth();
  const isAuthenticated = authStatus && authStatus.isAuthenticated;
  const token = localStorage.getItem("token");
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/MealPlans`);
        setMealPlans(response.data.Meals);
        // console.log("role", currentUserInfo.role)
        // console.log("user", TokenInfo.userId)
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      }
    };

    fetchMealPlans();
  }, [ BaseUrl]);

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
    verifySession();
  }, [fetchCurrentUser, fetchTokenInfo, verifySession]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      setNotification("Please log in to generate plans", "info");
      return;
    }

    try {
      const res = await axios.put(
        `${BaseUrl}/api/user/update/${TokenInfo.userId}`,
        {
          weight,
          activityLevel,
          goal,
          level,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        navigate("/Generate/MealsPlans");
      } else {
        setNotification(
          res.data.message || "An unexpected error occurred",
          "error"
        );
      }
    } catch (error: any) {
      console.error("Error during plan generation:", error);
      setNotification(
        error.response?.data.message ||
          "An error occurred while generating plans",
        "error"
      );
    }
  };

  return (
    <>
      <div className="mt-20 fixed w-full">
        {message && <Alert severity={type}>{message}</Alert>}
      </div>

      <Navbar />

      <section className="home " id="home">
        <div className="container mx-auto">
          <div className="flex items-center  pt-40">
            <div>
              <h1
                className="home__subtitle text-[4.7rem] font-semibold"
                // style={"-webkit-text-stroke: 1px white; color: transparent;"}
              >
                MAKE YOUR BODY SHAPE <br />
                <span className="text-[4.5rem]  font-bold ml-20 leading-none ">
                  WITH YOUFIT
                </span>
              </h1>
              <p className="mb-12 text-[#f0f8ff] w-full mt-16 leading-relaxed">
                Clean vs. Dirty Bulking Simply getting bigger is not better when
                it comes to the ideal bulking strategy. Old-school bodybuilders
                like Frank Zane and Vince Gironda —arguably two of the greatest
                physiques of all time—would tell you that you look a lot more
                impressive by adding five to eight pounds of fat-free muscle
                mass than by slapping on 10 pounds of muscle with 20 pounds of
                belly marbling. These days, traditional bulking strategies tend
                to fall under two broad categories, and they both leave much to
                be desired. <br /> <br />
                It doesn’t matter who’s wrong or right, just eat it, eat it, eat
                it: The “dirty” school of thought is that as long as you down
                enough protein, you can garbage disposal whatever else you want,
                regardless of food quality. Even if this “crap loading” works
                physique-wise, it’s not a wise choice from a long-term health
                perspective. (Admit it, you know.) <br /> <br />
                If you are pounding foods loaded with sugar, trans fats, and
                omega-6 vegetable oils every day, cell-membrane integrity and
                elasticity can be compromised, chronic systemic inflammation can
                predispose you to disease—or at least debilitating joint
                pain—and you may just end up with the emotional stability of a
                seesaw. <br /> <br />
              </p>
              <p className="mb-12 text-[#f0f8ff] w-full  leading-relaxed">
                <span className="font-bold text-2xl">
                  Bulking by the Numbers
                </span>{" "}
                <br /> <br />
                Lets take a step back for a second. Make no mistake, while we
                can argue over optimum dietary approaches into eternity,
                consistently hitting the right calories and macronutrients will
                always be the most important step in achieving any body
                composition goal, including bulking. Here’s a recommended
                starting point, using a 175-pound male as an example: <br />{" "}
                <br />
                CALORIES: 16 per pound of body weight 16 x 175 lbs = 2,800
                calories
                <br /> <br />
                + <br /> <br />
                PROTEIN: 1g per pound of body weight 1g x 175 lbs = 700 calories
                (175g protein) <br /> <br />
                +<br /> <br />
                FAT: 25% of calories 2,800 calories x 0.25 = 700 calories (75g
                fat) <br /> <br />
                + <br /> <br />
                CARBS: Remaining calories 2,800-700-700 = 1,400 calories (350g
                carbs) <br /> <br />
                From this starting point, everything needs to be tested,
                assessed, and refined in the real world to produce optimum
                results. Ectomorphs may need to push the calories up to 20 per
                pound of body weight. Endomorphs may need to implement a more
                cyclical dieting strategy by lowering calories to maintenance
                levels or below on rest days (12–14 per pound of body weight) in
                order to avoid gaining fat.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="home" id="calc">
        <div className="container">
          <div className="">
            <div className="calc__data">
              <p className="mb- text-[#f0f8ff] w-full  leading-relaxed">
                There for this is A Generator calculate your daily
                calories-needs depends on your Goal:
              </p>
              <h2 className="section-title">
                {" "}
                <span> Enter your </span> details below
              </h2>

              <form
                onSubmit={handleSubmit}
                className="calc__form"
                id="calc-form"
              >
                <div className="calc__input">
                  <input
                    type="number"
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Weight"
                    id="calc-kg"
                  />
                  <label>kg</label>
                </div>
                <div className="bg-transparent Activity">
                  <select
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full border-none bg-black p-4 border "
                  >
                    <option value="">Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="advanced">Advanced</option>
                    <option value="intermediate">Intermediate</option>
                  </select>
                </div>
                <div className="bg-transparent Activity">
                  <select
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full border-none bg-black  p-4 border "
                  >
                    <option className="" value="0">
                      Goal
                    </option>
                    <option value="lose weight">Losing Weight</option>
                    <option value="gain weight">Gaining Weight</option>
                  </select>
                </div>
                <div className="bg-transparent Activity">
                  <select
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full border-none bg-black p-4 border "
                  >
                    <option className="" value="">
                      Activity Level
                    </option>
                    <option value="moderate">moderate</option>
                    <option value="active">active</option>
                    <option value="very_active">very_active</option>
                  </select>
                </div>

                <button type="submit" className="btn calc__btn">
                  Generate Plans
                </button>

                <p className="calc__message" id="calc-message"></p>
              </form>
            </div>
            {token && currentUserInfo.weight ? (
              <Link
                className="btn w-full mt-2 calc__btn"
                to="/Generate/MealsPlans"
              >
                My Generating Meals
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <hr className="mt-10 mb-10" />
      <h1 className="text-[4.5rem]  font-bold ml-20 leading-none ">
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
      <Footer/>
    </>
  );
};

export default FetchMealPlans;
