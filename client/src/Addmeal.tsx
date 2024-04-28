import { FormEvent, useRef, useState } from "react";
import axios from "axios";
import { useNotification } from "./useNotification";
import { Alert } from "@mui/material";
import { Sidebar } from "./sidebar";

const AddMealPlan = () => {
  const [planName, setPlanName] = useState("");
  const [descriptionP, setDescriptionP] = useState("");
  // const [totalCalories, setTotalCalories] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mealNumber] = useState(1);
  const { setNotification } = useNotification();
  const { message, type } = useNotification();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BasesUrl = import.meta.env.VITE_BASE_URL;


  const [dailyMeals, setDailyMeals] = useState([
    {
      day: 1,
      calories: "",
      meals: [
        {
          title: `Meal ${mealNumber}`,
          description: "",
          protein: "",
          fats: "",
          carbs: "",
        },
      ],
    },
  ]);

  // Function to handle adding a new meal within a day
  const handleAddMeal = (dayIndex: number) => {
    const updatedDailyMeals = [...dailyMeals];
    const nextMealNumber = updatedDailyMeals[dayIndex].meals.length + 1;

    // Add the new meal with the dynamically calculated meal number
    updatedDailyMeals[dayIndex].meals.push({
      title: `Meal ${nextMealNumber}`,
      description: "",
      protein: "",
      fats: "",
      carbs: "",
    });

    setDailyMeals(updatedDailyMeals);
  };

  // Function to handle meal description change
  const handleChange = (
    dayIndex: number,
    mealIndex: number,
    value: string,
    type: string
  ) => {
    const newDailyMeals = [...dailyMeals];
    if (type === "description") {
      newDailyMeals[dayIndex].meals[mealIndex].description = value;
    } else if (type === "calories") {
      newDailyMeals[dayIndex].calories = value;
    } else if (type === "protein") {
      newDailyMeals[dayIndex].meals[mealIndex].protein = value;
    } else if (type === "carbs") {
      newDailyMeals[dayIndex].meals[mealIndex].carbs = value;
    } else if (type === "fats") {
      newDailyMeals[dayIndex].meals[mealIndex].fats = value;
    }
    setDailyMeals(newDailyMeals);
  };

  const handleDeleteMeal = (dayIndex: number, mealIndex: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this meal?"
    );
    if (isConfirmed) {
      const updatedDailyMeals = [...dailyMeals];
      updatedDailyMeals[dayIndex].meals.splice(mealIndex, 1); // Remove the meal

      // Renumber the remaining meals
      updatedDailyMeals[dayIndex].meals.forEach((meal, index) => {
        meal.title = `Meal ${index + 1}`;
      });
      setDailyMeals(updatedDailyMeals);
    }
  };
  const handleAddDay = () => {
    setDailyMeals([
      ...dailyMeals,
      {
        day: dailyMeals.length + 1,
        calories: "",
        meals: [
          {
            title: `Meal ${mealNumber}`,
            description: "",
            protein: "",
            fats: "",
            carbs: "",
          },
        ],
      },
    ]);
  };
  const handleDeleteDay = (dayIndex: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this day?"
    );
    if (isConfirmed) {
      let updatedDailyMeals = [...dailyMeals];
      updatedDailyMeals.splice(dayIndex, 1);

      updatedDailyMeals = updatedDailyMeals.map((day, index) => ({
        ...day,
        day: index + 1, // This renumbers days starting from 1
      }));
      setDailyMeals(updatedDailyMeals);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Plan_Name", planName);
    formData.append("descriptionP", descriptionP);
    // formData.append("totalCalories", totalCalories);
    if (fileInputRef.current?.files) {
      formData.append("thumbnail", fileInputRef.current.files[0]);
    }
    formData.append("dailyMeals", JSON.stringify(dailyMeals)); // Convert dailyMeals array to JSON string

    try {
      const response = await axios.post(
        `${BasesUrl}/api/Meal/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setNotification(response.data.message, response.data.type || "error");
        setPlanName("");
        setDescriptionP("");
        // setTotalCalories("");
        setDailyMeals([
          {
            day: 1,
            calories: "",
            meals: [
              {
                title: `Meal ${mealNumber}`,
                description: "",
                protein: "",
                carbs: "",
                fats: "",
              },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding meal plan:", error);
    }
  };

  return (
    <div className="flex justify-between">
      <div>
        <Sidebar />
      </div>

      <div className="  mx-auto px-4 ml-72 w-full py-8">
        <div className="fixed w-full">
          {message && <Alert severity={type}>{message}</Alert>}
        </div>
        <h1 className="text-xl font-semibold mb-4">Add New Meal Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white font-bold">Meal Plan Name :</label>
            <div className="border p-2 mt-2">
              <input
                type="text"
                placeholder=" Simple Meal Plan "
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="border p-1 bg-black w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-white font-bold">Description :</label>
            <div className="border  mt-2">
              <textarea
                value={descriptionP}
                onChange={(e) => setDescriptionP(e.target.value)}
                className="bg-black p-2 h-32 w-full"
              />
            </div>
          </div>

          {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Calories
            </label>
            <input
              type="text"
              placeholder="Total Calories"
              value={totalCalories}
              onChange={(e) => setTotalCalories(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div> */}
          <label className="flex items-center mb-4 mt-6 cursor-pointer">
            <span className="mr-2 ml-2 mt-2 text-gray-300 font-semibold ">
              Thumbnail
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
              <h4 className="font-semibold text-2xl text-center mb-4">
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
                <div key={mealIndex} className="items-center border p-2  space-x-2">
                  <p className="flex-1 text-xl font-semibold text-white mt-4 mb-4 ">
                    {meal.title}
                  </p>
                  <div>
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
                    <label className="text-white font-bold">
                      Total carbs :
                    </label>
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
                    onClick={() => handleDeleteMeal(dayIndex, mealIndex)}
                    className="bg-red-500 px-6 py-2 text-white"
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
                Add Meal
              </button>
              <br />
              <div className="flex  justify-end ">
                <button
                  type="button"
                  onClick={() => handleDeleteDay(dayIndex)}
                  className="bg-red-500 px-6 py-2 text-white"
                >
                  Delete Day
                </button>
              </div>
            </div>
          ))}
          <div className="flex">
            <button
              type="button"
              onClick={handleAddDay}
              className="bg-gray-400 px-6 py-2 text-white"
            >
              Add Day
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Submit 
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMealPlan;
