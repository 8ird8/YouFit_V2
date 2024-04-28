import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Meal {
  title: string;
  description: string;
  protein: string;
  carbs: string;
  fats: string;
  [key: string]: string;
  // Add other meal properties as needed
}

interface DailyMeal {
  day: number;
  calories: number;
  meals: Meal[];
  // Add other day properties as needed
}
const UpdateMealPlan = () => {
  const { planId } = useParams();
  const [Plan_Name, setPlanName] = useState("");
  const [descriptionP, setDescriptionP] = useState("");
  const [totalCalories, setTotalCalories] = useState("");
  const [dailyMeals, setDailyMeals] = useState<DailyMeal[]>([]);
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  // const [mealNumber, setMealNumber] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/MealPlan/${planId}`
        );
        const planData = response.data.PlanDetail;
        setPlanName(planData.Plan_Name || "");
        setDescriptionP(planData.descriptionP || "");
        setTotalCalories(planData.totalCalories || "");

        setDailyMeals(planData.dailyMeals || []);
      } catch (error) {
        console.error("Failed to fetch meal plan details:", error);
      }
    };

    fetchMealPlan();
  }, [planId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Plan_Name", Plan_Name);
    formData.append("descriptionP", descriptionP);
    formData.append("totalCalories", totalCalories);
    if (fileInputRef.current?.files) {
      formData.append("thumbnail", fileInputRef.current.files[0]);
    }
    const mealsForSubmission = dailyMeals.map((day) => ({
      ...day,
      meals: day.meals.map((meal) => {
        const { _id, ...restMeal } = meal;
        return _id?.startsWith("temp-") ? restMeal : meal;
      }),
    }));
    formData.append("dailyMeals", JSON.stringify(mealsForSubmission));

    try {
      const response = await axios.put(
        `${BaseUrl}/api/MealPlan/update/${planId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        navigate(-1);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error updating meal plan:", error);
    }
  };

  const handleAddDay = () => {
    // const maxday = dailyMeals.reduce((max, day) => Math.max(max, day.day), 0);
    const newDay = { day: dailyMeals.length + 1, meals: [], calories: 0 };
    setDailyMeals([...dailyMeals, newDay]);
  };

  const deleteDay = async (dayIndex: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this day?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `${BaseUrl}/api/MealPlan/${planId}/day/${dayIndex}`
        );
        let updatedDailyMeals = [...dailyMeals];
        updatedDailyMeals.splice(dayIndex, 1);

        updatedDailyMeals = updatedDailyMeals.map((day, index) => ({
          ...day,
          day: index + 1, // This renumbers days starting from 1
        }));
        setDailyMeals(updatedDailyMeals);
      } catch (error) {
        console.error("Error deleting day:", error);
      }
    }
  };

  const handleAddMeal = (dayIndex: number) => {
    const newDailyMeals = [...dailyMeals];

    const newMealId = `temp-${Date.now()}${Math.random()}`;
    const nextMealNumber = newDailyMeals[dayIndex].meals.length + 1;
    // Create the new meal object
    const newMeal = {
      _id: newMealId,
      title: `Meal ${nextMealNumber}`,
      description: "",
      protein: "",
      fats: "",
      carbs: "",
    };
    newDailyMeals[dayIndex].meals.push(newMeal);
    setDailyMeals(newDailyMeals);
  };

  const deleteMeal = async (dayIndex: number, mealId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this meal?"
    );
    if (isConfirmed) {
      try {
        const isTemporaryId =
          typeof mealId === "string" && mealId.startsWith("temp-");

        if (!isTemporaryId) {
          // If meal has a permanent ID from the database, proceed to delete it
          await axios.delete(
            `${BaseUrl}/api/MealPlan/${planId}/day/${dayIndex}/meal/${mealId}`
          );
        }

        // Filter out the meal to be deleted and renumber the remaining meals
        const filteredAndRenumberedMeals = dailyMeals[dayIndex].meals
          .filter((meal) => meal._id !== mealId)
          .map((meal, index) => ({
            ...meal,
            title: `Meal ${index + 1}`, // Renumbering the title of each meal
          }));

        // Update the state with the new meals array for the specific day
        const newDailyMeals = dailyMeals.map((day, index) => {
          if (index === dayIndex) {
            return { ...day, meals: filteredAndRenumberedMeals };
          }
          return day;
        });

        setDailyMeals(newDailyMeals);
      } catch (error) {
        console.error("Error deleting meal:", error);
      }
    }
  };

  const handleChange = (
    dayIndex: number,
    mealIndex: number,
    value: string,
    field: keyof Meal | "calories"
  ) => {
    const updatedDailyMeals = [...dailyMeals];

    if (field === "calories") {
      updatedDailyMeals[dayIndex].calories = parseInt(value);
    } else {
      updatedDailyMeals[dayIndex].meals[mealIndex][field] = value;
    }

    setDailyMeals(updatedDailyMeals);
  };

  return (
    <div className="px-40  mx-auto  py-8">
      <div className="flex justify-between">
        <button onClick={() => navigate(-1)}>
          <img
            className="w-10 h-10 bg-lime-400 rounded-full p-2"
            src={`${AssetsUrl}/arrowleft.png`}
            alt="arrow-left"
          />
        </button>
      </div>
      <h1 className="text-xl font-semibold mb-4">Update Meal Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label className="text-white font-bold">Meal Plan Name :</label>
          <div className="border p-2 mt-2">
            <input
              type="text"
              placeholder="Meal Plan Name"
              value={Plan_Name}
              onChange={(e) => setPlanName(e.target.value)}
              className="border p-1 bg-black w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-white font-bold">Description :</label>
          <div className="border  mt-2">
            <textarea
              placeholder="Description"
              value={descriptionP}
              onChange={(e) => setDescriptionP(e.target.value)}
              className="bg-black p-2 h-32 w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-white font-bold">Total Calories :</label>
          <div className="border  mt-2">
            <input
              type="text"
              placeholder="Total Calories"
              value={totalCalories}
              onChange={(e) => setTotalCalories(e.target.value)}
              className="bg-black p-2  w-full"
            />
          </div>
        </div>
        <label className="flex items-center mb-4 mt-6 cursor-pointer">
          <span className="mr-2 ml-2 mt-2 text-gray-300 font-semibold ">
            New Thumbnail
          </span>
          <img
            src={`${AssetsUrl}/upload.png`}
            alt="image"
            className="w-8 h-8"
          />
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/gif"
            id="image"
            name="imageUrl"
            ref={fileInputRef}
          />
        </label>
        {dailyMeals.map((day, dayIndex) => (
          <div key={dayIndex} className="border p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-4xl text-center">
              Day {day.day}
            </h4>
            <div>
              <label className="text-white  ">Day Calories :</label>
              <div className="border p-2 mt-2">
                <input
                  type="number"
                  placeholder="0"
                  value={day.calories}
                  onChange={(e) =>
                    handleChange(dayIndex, 0, e.target.value, "calories")
                  }
                  className="input input-bordered w-full bg-black "
                />
              </div>
            </div>
            {day.meals.map((meal, mealIndex) => (
              <div key={mealIndex} className=" border items-center p-2">
                <div className="border p-2  bg-black w-full">
                  <input
                    className="text-3xl text-white w-full font-semibold flex-1"
                    placeholder={`Meal ${mealIndex + 1}`}
                    value={meal.title || ""}
                    onChange={(e) =>
                      handleChange(dayIndex, mealIndex, e.target.value, "title")
                    }
                  />
                </div>
                <div className="mt-4 mb-4">
                  <label className="text-white font-bold">Content :</label>
                  <div className="border  mt-2">
                    <textarea
                      className="bg-black h-40 p-2 w-full"
                      value={meal.description}
                      onChange={(e) =>
                        handleChange(
                          dayIndex,
                          mealIndex,
                          e.target.value,
                          "description"
                        )
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 mb-4">
                  <label className="text-white font-bold">
                    Total protein :
                  </label>
                  <div className="border  mt-2">
                    <input
                      type="number"
                      placeholder="'gram'"
                      value={meal.protein}
                      onChange={(e) =>
                        handleChange(
                          dayIndex,
                          mealIndex,
                          e.target.value,
                          "protein"
                        )
                      }
                      className="p-2 w-full bg-black "
                    />
                  </div>
                </div>
                <div className="mt-4 mb-4">
                  <label className="text-white font-bold">Total carbs :</label>
                  <div className="border  mt-2">
                    <input
                      type="number"
                      placeholder="Carbs 'gram' "
                      value={meal.carbs}
                      onChange={(e) =>
                        handleChange(
                          dayIndex,
                          mealIndex,
                          e.target.value,
                          "carbs"
                        )
                      }
                      className="p-2 w-full bg-black "
                    />
                  </div>
                </div>
                <div className="mt-4 mb-4">
                  <label className="text-white font-bold">Total fats :</label>
                  <div className="border  mt-2">
                    <input
                      type="number"
                      placeholder="Fats 'gram' "
                      value={meal.fats}
                      onChange={(e) =>
                        handleChange(
                          dayIndex,
                          mealIndex,
                          e.target.value,
                          "fats"
                        )
                      }
                      className="p-2 w-full bg-black "
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteMeal(dayIndex, meal._id)}
                  className=" bg-red-600   font-light text-white px-4 py-2"
                >
                  Delete Meal
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddMeal(dayIndex)}
              className="bg-gray-400 px-6 py-2 text-white"
            >
              Add  Meal
            </button>
            <br />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => deleteDay(dayIndex)}
                className=" bg-red-600   font-light text-white px-4 py-2"
              >
                Delete Day
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddDay}
            className="bg-gray-400 px-6 py-2 text-white"
          >
            Add Day
          </button>
        </div>
        <button type="submit" className="btn w-full btn-primary mt-4">
          Update Meal Plan
        </button>
      </form>
    </div>
  );
};

export default UpdateMealPlan;
