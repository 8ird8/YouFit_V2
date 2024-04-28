import { FormEvent, useRef, useState } from "react";
import axios from "axios";
import { Sidebar } from "./sidebar";
import { useNotification } from "./useNotification";
import { Alert } from "@mui/material";

const AddWorkoutPlan = () => {
  const [nameOfprogram, setNameOfprogram] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const { setNotification, message, type } = useNotification();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ExNumber, setExNumber] = useState(1);
  const BasesUrl = import.meta.env.VITE_BASE_URL;


  const [dailyExercises, setDailyExercises] = useState([
    {
      day: 1,
      exercises: [
        {
          name_Ex: `Exercises ${ExNumber}`,
          description_Ex: "",
          videoUrl: "",
          intensity: "",
        },
      ],
    },
  ]);

  const handleAddWorkout = (dayIndex: number) => {
    const updatedDailyExercises = [...dailyExercises];
    const nextExNumber = updatedDailyExercises[dayIndex].exercises.length + 1;
    setExNumber(nextExNumber);

    // Add the new meal with the dynamically calculated meal number
    updatedDailyExercises[dayIndex].exercises.push({
      name_Ex: `Exercises ${nextExNumber}`,
      description_Ex: "",
      videoUrl: "",
      intensity: "",
    });

    setDailyExercises(updatedDailyExercises);
  };

  const handleDeleteExersise = (dayIndex: number, ExIndex: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Exersise?"
    );
    if (isConfirmed) {
      const updatedDailyExercises = [...dailyExercises];
      updatedDailyExercises[dayIndex].exercises.splice(ExIndex, 1); // Remove the meal

      // Renumber the remaining exercises
      updatedDailyExercises[dayIndex].exercises.forEach((exercise, index) => {
        exercise.name_Ex = `Exersise ${index + 1}`;
      });
      setDailyExercises(updatedDailyExercises);
    }
  };

  const handleAddDay = () => {
    setDailyExercises([
      ...dailyExercises,
      {
        day: dailyExercises.length + 1,
        exercises: [
          {
            name_Ex: `Exercises ${ExNumber}`,
            description_Ex: "",
            videoUrl: "",
            intensity: "",
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
      let updatedDailyExercises = [...dailyExercises];
      updatedDailyExercises.splice(dayIndex, 1);

      updatedDailyExercises = updatedDailyExercises.map((day, index) => ({
        ...day,
        day: index + 1, // This renumbers days starting from 1
      }));
      setDailyExercises(updatedDailyExercises);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nameOfprogram", nameOfprogram);
    formData.append("description", description);
    formData.append("gender", gender);
    formData.append("category", category);

    if (fileInputRef.current?.files) {
      formData.append("thumbnail_W", fileInputRef.current.files[0]);
    }
    formData.append("dailyExercises", JSON.stringify(dailyExercises)); // Convert dailyExercises array to JSON string

    try {
      const response = await axios.post(
        `{${BasesUrl}/api/add/workoutPlan`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setNameOfprogram("");
        setDescription("");
        setGender("");
        setNotification(response.data.message, "success");
        setCategory("");
        setDailyExercises([
          {
            day: 1,
            exercises: [
              {
                name_Ex: `Exercise ${ExNumber}`,
                description_Ex: "",
                videoUrl: "",
                intensity: "",
              },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding meal plan:", error);
    }
  };

  const handleChange = (
    dayIndex: number,
    ExIndex: number,
    value: string,
    type: string
  ) => {
    const newdailyExercises = [...dailyExercises];
    if (type === "description_Ex") {
      newdailyExercises[dayIndex].exercises[ExIndex].description_Ex = value;
    } else if (type === "intensity") {
      newdailyExercises[dayIndex].exercises[ExIndex].intensity = value;
    } else if (type === "videioUrl") {
      newdailyExercises[dayIndex].exercises[ExIndex].videoUrl = value;
    } else if (type === "name_Ex") {
      newdailyExercises[dayIndex].exercises[ExIndex].name_Ex = value;
    }

    setDailyExercises(newdailyExercises);
  };

  return (
    <div className="flex   justify-between">
      <div>
        <Sidebar />
      </div>
      <div className="  mx-auto px-4 ml-72 w-full py-8">
        <div className="mt-20 fixed w-full">
          {message && <Alert severity={type}>{message}</Alert>}
        </div>
        <h1 className="text-xl font-semibold mb-4">Add New Workout Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white font-bold">Workout Plan Name :</label>
            <div className="border p-2 mt-2">
              <input
                type="text"
                value={nameOfprogram}
                onChange={(e) => setNameOfprogram(e.target.value)}
                className="p2 w-full bg-black"
              />
            </div>
          </div>
          <div>
            <label className="text-white font-bold">Description :</label>
            <div className="border  mt-2">
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className=" h-32 p-2 bg-black w-full"
              />
            </div>
          </div>

          <div>
            <select
              className="title rounded bg-black border border-gray-300 p-2 mb-4 w-full outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value=""> For Male/Female</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <select
              className="title rounded w-full bg-black border border-gray-300 p-2 mb-2 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value=""> Category</option>
              <option value="beginner">Beginner</option>
              <option value="middle">Middle</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <label className="flex items-center mb-4  cursor-pointer">
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
          {dailyExercises.map((day, dayIndex) => (
            <div key={dayIndex} className="border p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-2xl text-center ">
                Day {day.day}
              </h3>

              {day.exercises.map((exercise, ExIndex) => (
                <div
                  key={ExIndex}
                  className="items-center border p-2 space-x-2"
                >
                  <div>
                    <div className="border bg-black p-2">
                      {/* <label className="text-white font-bold">VideoUrl :</label> */}
                      <input
                        className=" w-full "
                        placeholder={`Exercise ${ExIndex + 1}`}
                        value={exercise.name_Ex}
                        onChange={(e) =>
                          handleChange(
                            dayIndex,
                            ExIndex,
                            e.target.value,
                            "name_Ex"
                          )
                        }
                      />
                    </div>
                    {/* <label className="text-white font-bold">
                      {exercise.name_Ex} :
                    </label> */}
                    <div className="border  mt-2">
                      <textarea
                        className="bg-black p-2 w-full"
                        placeholder="Description"
                        value={exercise.description_Ex}
                        onChange={(e) =>
                          handleChange(
                            dayIndex,
                            ExIndex,
                            e.target.value,
                            "description_Ex"
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 mb-4">
                    <label className="text-white font-bold">VideoUrl :</label>
                    <div className="border  mt-2">
                      <input
                        type="text"
                        placeholder="VideoUrl"
                        value={exercise.videoUrl}
                        onChange={(e) =>
                          handleChange(
                            dayIndex,
                            ExIndex,
                            e.target.value,
                            "videioUrl"
                          )
                        }
                        className="p-2 w-full "
                      />
                    </div>
                  </div>

                  <div>
                    <select
                      className="title rounded bg-black border border-gray-300 p-2 mb-4 outline-none"
                      value={exercise.intensity}
                      onChange={(e) =>
                        handleChange(
                          dayIndex,
                          ExIndex,
                          e.target.value,
                          "intensity"
                        )
                      }
                      required
                    >
                      <option value=""> intensity</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Very_High">Very_High</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteExersise(dayIndex, ExIndex)}
                    className="bg-red-500 px-6 py-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddWorkout(dayIndex)}
                className="bg-gray-400 px-6 py-2 text-white"
              >
                Add Exercise
              </button>
              <br />
              <div className="flex  justify-end ">
                <button
                  type="button"
                  onClick={() => handleDeleteDay(dayIndex)}
                  className="bg-red-500 px-6 py-2 text-white"
                >
                  Delete Full Day
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

export default AddWorkoutPlan;
