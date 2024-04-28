import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "./sidebar";

interface exercise {
  name_Ex: string;
  description_Ex: string;
  intensity: string;
  videoUrl: string;
  [key: string]: string;
  // Add other exersise properties as needed
}

interface DailyExercise {
  day: number;
  level: string;
  exercises: exercise[];
  // Add other day properties as needed
}
const UpdateWorkoutPlan = () => {
  const { workoutId } = useParams();
  const [nameOfprogram, setNameOfprogram] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [dailyExercises, setdailyExercises] = useState<DailyExercise[]>([]);
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  // const [exersiseNumber, setexersiseNumber] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/WorkoutPlans/${workoutId}`
        );
        const planData = response.data.WorkoutDetail;
        setNameOfprogram(planData.nameOfprogram);
        setDescription(planData.description);
        setdailyExercises(planData.dailyExercises);
        setGender(planData.gender);
        setCategory(planData.category);
      } catch (error) {
        console.error("Failed to fetch exersise plan details:", error);
      }
    };

    fetchWorkoutPlan();
  }, [workoutId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nameOfprogram", nameOfprogram);
    formData.append("description", description);
    formData.append("gender", gender);
    formData.append("category", category);
    if (fileInputRef.current?.files) {
      formData.append("thumbnail_W", fileInputRef.current.files[0]);
    }
    const exerciseForsub = dailyExercises.map((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) => {
        const { _id, ...restexersise } = exercise;
        return _id?.startsWith("temp-") ? restexersise : exercise;
      }),
    }));
    formData.append("dailyExercises", JSON.stringify(exerciseForsub));

    try {
      const response = await axios.put(
        `${BaseUrl}/api/WorkoutPlans/update/${workoutId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        navigate("/workoutPlans");
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error updating exersise plan:", error);
    }
  };

  const handleAddDay = () => {
    // const maxday = dailyExercises.reduce((max, day) => Math.max(max, day.day), 0);
    const newDay = { day: dailyExercises.length + 1, exercises: [], level: "" };
    setdailyExercises([...dailyExercises, newDay]);
    // const newDay = { day: maxday + 1, exersises: [], calories: 0 };
    // setdailyExercises([...dailyExercises, newDay]);
  };

  const deleteDay = async (dayIndex: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this day?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(
          `${BaseUrl}/api/WorkoutPlans/${workoutId}/day/${dayIndex}`
        );
        let updatedDailyExercises = [...dailyExercises];
        updatedDailyExercises.splice(dayIndex, 1);

        updatedDailyExercises = updatedDailyExercises.map((day, index) => ({
          ...day,
          day: index + 1, // This renumbers days starting from 1
        }));
        setdailyExercises(updatedDailyExercises);
      } catch (error) {
        console.error("Error deleting day:", error);
      }
    }
  };

  const handleAddExersise = (dayIndex: number) => {
    const newdailyExercises = [...dailyExercises];
    // Generate a temporary  ID for
    const newExId = `temp-${Date.now()}${Math.random()}`;
    const nextExNumber = newdailyExercises[dayIndex].exercises.length + 1;
    // Create the new exersise object
    const newExercise = {
      _id: newExId,
      name_Ex: `Exercise ${nextExNumber}`,
      description_Ex: "",
      intensity: "",
      videoUrl: "",
    };

    newdailyExercises[dayIndex].exercises.push(newExercise);
    setdailyExercises(newdailyExercises);
  };

  const deleteExersise = async (dayIndex: number, exersiseId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this exercise?"
    );
    if (isConfirmed) {
      try {
        const isTemporaryId =
          typeof exersiseId === "string" && exersiseId.startsWith("temp-");

        if (!isTemporaryId) {
          // If exersise has a permanent ID from the database, proceed to delete it
          await axios.delete(
            `${BaseUrl}/api/WorkoutPlans/${workoutId}/day/${dayIndex}/exersise/${exersiseId}`
          );
        }

        const updatedExercises = dailyExercises[dayIndex].exercises.filter(
          (exercise) => exercise._id !== exersiseId
        );

        // Renumber the remaining exercises
        const renumberedExercises = updatedExercises.map((exercise, index) => ({
          ...exercise,
          name_Ex: `Exercise ${index + 1}`,
        }));

        // Update the day's exercises
        const updatedDays = dailyExercises.map((day, index) => {
          if (index === dayIndex) {
            return { ...day, exercises: renumberedExercises };
          }
          return day;
        });

        setdailyExercises(updatedDays);
      } catch (error) {
        console.error("Error deleting exersise:", error);
      }
    }
  };

  const handleChange = (
    dayIndex: number,
    ExIndex: number,
    value: string,
    field: string
  ) => {
    const updateddailyExercises = [...dailyExercises];

    if (field === "level") {
      updateddailyExercises[dayIndex].level = value;
    } else if (field === "day") {
      updateddailyExercises[dayIndex].day = parseInt(value);
    } else {
      updateddailyExercises[dayIndex].exercises[ExIndex][field] = value;
    }

    setdailyExercises(updateddailyExercises);
  };

  return (
    <div className=" flex px-10 mx-auto  py-8">
      <Sidebar />
      <div className="  mx-auto px-4 ml-72 w-full py-8">
        <button onClick={() => navigate(-1)}>
          <img
            className="w-10 h-10  bg-lime-400 rounded-full p-2"
            src={`${AssetsUrl}/arrowleft.png`}
            alt="arrow-left"
          />
        </button>
        <h1 className="text-xl  font-semibold mb-4">Update exersise Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="text-white font-bold">Workout Plan Name :</label>
            <div className="border  mt-2">
              <input
                type="text"
                placeholder="Workout Plan Name"
                value={nameOfprogram}
                onChange={(e) => setNameOfprogram(e.target.value)}
                className="p-2 bg-black w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-white font-bold">Gender :</label>
            <select
              className="title rounded bg-black border border-gray-300 p-2 mt-2 w-full outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="text-white font-bold">Category :</label>
            <select
              className=" rounded w-full bg-black border border-gray-300 p-2 mb-2 mt-2 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="middle">Middle</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <div>
            <label className="text-white font-bold">Description :</label>
            <div className="border mt-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black  h-40 p-2 textarea-bordered w-full"
              />
            </div>
          </div>

          <label className="flex items-center mb-4 mt-4 cursor-pointer">
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

          {dailyExercises.map((day, dayIndex) => (
            <div key={dayIndex} className="border  p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-center text-3xl">
                Day {day.day}
              </h4>
              {/* <input
                type="text"
                value={day.day}
                onChange={(e) =>
                  handleChange(dayIndex, 0, e.target.value, "day")
                }
                className="input input-bordered w-full mb-2"
              /> */}

              {day.exercises.map((exercise, ExIndex) => (
                <div
                  key={ExIndex}
                  className=" border p-4 items-center space-y-4"
                >
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
                  <div>
                    <label className="text-white font-bold">Content :</label>
                    <div className="border  mt-2">
                      <textarea
                        className="bg-black px-1 w-full"
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
                            "videoUrl"
                          )
                        }
                        className="p-2 w-full  bg-black"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
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
                    >
                      <option value=""> intensity</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Very_High">Very_High</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => deleteExersise(dayIndex, exercise._id)}
                      className=" px-4 py-2 bg-red-600 h-10 my-auto text-white"
                    >
                      Delete Exersise
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddExersise(dayIndex)}
                className="bg-gray-400 px-6 py-2 text-white"
              >
                Add Exersise
              </button>
              <br />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteDay(dayIndex)}
                  className=" px-4 py-2 bg-red-600 h-10 my-auto text-white"
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
              className="bg-gray-400 px-6 py-2 text-white h-14"
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

export default UpdateWorkoutPlan;
