const Workout = require("../models/workoutPlan");
const fs = require("fs").promises;
const path = require("path");
const User = require("../models/user");

const AddWorkoutPlan = async (req, res) => {
  try {
    const { nameOfprogram, description, gender, category } = req.body;

    const dailyExercises = req.body.dailyExercises
      ? JSON.parse(req.body.dailyExercises)
      : [];

    const thumbnailPath = req.file ? req.file.filename : "";
    // const videoPath = req.files['video'] ? req.files['video'][0].filename : "";

    // Map videos to exercises based on a strategy (e.g., matching filenames with exercise names or indexes)
    // dailyExercises = dailyExercises.map((day) => {
    //   day.exercises = day.exercises.map((exercise) => {
    //     const videoFile = videoFiles.find((file) =>
    //       shouldLinkVideoToFile(exercise, file)
    //     );
    //     if (videoFile) {
    //       exercise.videoUrl = videoFile.path; // Adjust this according to how you serve files
    //     }
    //     return exercise;
    //   });
    //   return day;
    // });
    const newWorkoutPlan = new Workout({
      nameOfprogram,
      description,
      thumbnail_W: thumbnailPath,
      gender,
      category,
      dailyExercises,
    });

    await newWorkoutPlan.save();

    console.log("Workout Plan Added Successfully:", newWorkoutPlan);

    res.status(200).json({
      success: true,
      message: "Workout  plan added successfully",
      data: newWorkoutPlan,
    });
  } catch (error) {
    console.error("Error adding workout plan:", error);
    res.status(500).json({ success: false, message: "Error adding meal plan" });
  }
};

const fetchWorkoutPlan = async (req, res) => {
  try {
    const WorkoutPLan = await Workout.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, WorkoutPLan });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching workouts" });
  }
};

const fetchById = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const WorkoutDetail = await Workout.findById(workoutId);
    return res.status(200).json({ success: true, WorkoutDetail });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching workout" });
  }
};

const FiltredWorkoutPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, type: "error", message: "User not found" });
    }

    const workouts = await Workout.find({ gender: user.gender });

    if (workouts.length === 0) {
      console.log(workouts);
      console.log(user.gender);
      return res
        .status(404)
        .json({
          success: false,
          type: "error",
          message: "No workout plans found for your gender",
        });
      
    }

    console.log(workouts);
    console.log(user.gender);
    return res.status(200).json({ success: true, workouts });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({
        success: false,
        type: "error",
        message: "Error fetching workout plans",
      });
  }
};

const deleteworkout = async (req, res) => {
  const { workoutId } = req.params;
  try {
    const workoutToDelete = await Workout.findById(workoutId);

    if (!workoutToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Workout not found" });
    }

    const filename = workoutToDelete.thumbnail_W;
    if (filename) {
      fs.unlink(path.join(__dirname, "../uploads", filename), (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found or already deleted" });
    }

    res
      .status(200)
      .json({ success: true, message: "Workout deleted successfully" });
  } catch (err) {
    console.error("Error deleting Plan:", err);
    res.status(500).json({ success: false, message: "Error deleting Plan" });
  }
};

const deleteExersise = async (req, res) => {
  const { workoutId, dayIndex, exersiseId } = req.params; // Assuming these are passed as URL parameters

  try {
    const WorkoutPlan = await Workout.findById(workoutId);

    if (!WorkoutPlan) {
      return res
        .status(404)
        .json({ success: false, message: "workout plan not found" });
    }

    // Remove the Exersise from the specified day
    const day = WorkoutPlan.dailyExercises[dayIndex];
    if (!day) {
      return res.status(404).json({ success: false, message: "Day not found" });
    }

    // Find the index of the Exersise to delete by its ID
    const ExIndex = day.exercises.findIndex(
      (exercise) => exercise._id.toString() === exersiseId
    );

    if (ExIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "exersise not found" });
    }

    // Remove the Exersise using the found index
    day.exercises.splice(ExIndex, 1);

    await WorkoutPlan.save();

    res
      .status(200)
      .json({ success: true, message: "Exersise deleted successfully" });
  } catch (err) {
    console.error("Error deleting Exersise:", err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting Exersise" });
  }
};
const deleteDay = async (req, res) => {
  const { workoutId, dayIndex } = req.params; // Assuming these are passed as URL parameters

  try {
    const workoutPlan = await Workout.findById(workoutId);

    if (!workoutPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Workout plan not found" });
    }

    // Remove the specified day
    workoutPlan.dailyExercises.splice(dayIndex, 1);

    await workoutPlan.save();

    res
      .status(200)
      .json({ success: true, message: "Day deleted successfully" });
  } catch (err) {
    console.error("Error deleting day:", err);
    res.status(500).json({ success: false, message: "Error deleting day" });
  }
};
const UpdatePlan = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const PlanWorkout = await Workout.findById(workoutId);
    const dailyExercises = req.body.dailyExercises
      ? JSON.parse(req.body.dailyExercises)
      : PlanWorkout.dailyExercises;

    let updateData = {
      nameOfprogram: req.body.nameOfprogram
        ? req.body.nameOfprogram
        : PlanWorkout.nameOfprogram,
      description: req.body.description
        ? req.body.description
        : PlanWorkout.description,
      dailyExercises: dailyExercises,
    };

    // If a new thumbnail is uploaded, handle the file and update the thumbnail path
    if (req.file) {
      updateData.thumbnail_W = req.file.filename;

      // Find the existing meal plan to get the old thumbnail path for deletion

      if (PlanWorkout && PlanWorkout.thumbnail_W) {
        fs.unlink(
          path.join(__dirname, "../uploads", PlanWorkout.thumbnail_W),
          (err) => {
            if (err) {
              console.error("Error deleting old thumbnail:", err);
            }
          }
        );
      }
    }

    const updatedWorkoutPlan = await Workout.findByIdAndUpdate(
      workoutId,
      updateData,
      { new: true }
    );
    if (!updatedWorkoutPlan) {
      return res.status(404).send({ message: "Workout plan not found." });
    }
    console.log(updatedWorkoutPlan);
    res.status(200).json(updatedWorkoutPlan);
  } catch (error) {
    console.error("Error updating wokring plan:", error);
    res.status(500).send({ message: "Error updating workout plan." });
  }
};

module.exports = {
  AddWorkoutPlan,
  fetchWorkoutPlan,
  fetchById,
  deleteworkout,
  deleteExersise,
  UpdatePlan,
  deleteDay,
  FiltredWorkoutPlan,
};
