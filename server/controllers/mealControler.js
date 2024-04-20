const MealPlan = require("../models/meal");
const User = require("../models/user");
const fs = require("fs").promises;
const path = require("path");

const addMealPlan = async (req, res) => {
  try {
    // Assuming the structure sent from the front end matches the model, especially for the meals and days part
    const { Plan_Name, descriptionP, totalCalories } = req.body;

    // Parse 'dailyMeals' from a stringified JSON if it's provided as such
    // Ensure your client sends this as a stringified JSON
    const dailyMeals = req.body.dailyMeals
      ? JSON.parse(req.body.dailyMeals)
      : [];

    // Handling the file path for the thumbnail
    const thumbnailPath = req.file ? req.file.filename : "";

    const newMealPlan = new MealPlan({
      Plan_Name,
      descriptionP,
      thumbnail: thumbnailPath,
      totalCalories,
      dailyMeals, // This is now parsed from a string to an actual JavaScript object/array
    });

    await newMealPlan.save();

    console.log("Meal Plan Added Successfully:", newMealPlan);

    res.status(200).json({
      success: true,
      type: "success",
      message: "Meal plan added successfully",
      data: newMealPlan,
    });
  } catch (error) {
    console.error("Error adding meal plan:", error);
    res
      .status(500)
      .json({
        success: false,
        type: "error",
        message: "Error adding meal plan",
      });
  }
};

const FetchingMeals = async (req, res) => {
  try {
    const Meals = await MealPlan.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, Meals });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching meals" });
  }
};

const FiltredMeals = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user || !user.weight) {
      return res.status(400).json({
        success: false,
        message: "User weight not found or invalid userId",
      });
    }

    const userWeight = Number(user.weight * 2.2);
    let dailyCaloriesNeeded;

    switch (user.activityLevel) {
      case "moderate":
        dailyCaloriesNeeded = userWeight * 14;
        break;
      case "active":
        dailyCaloriesNeeded = userWeight * 15;
        break;
      case "very_active":
        dailyCaloriesNeeded = userWeight * 16;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid or undefined activity level",
        });
    }

    if (user.goal === "lose weight") {
      if (user.level === "beginner") {
        dailyCaloriesNeeded -= 200;
      } else if (user.level === "Advanced") {
        dailyCaloriesNeeded -= 300;
      } else if (user.level === "intermidiare") {
        dailyCaloriesNeeded -= 400;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid or undefined activity level",
        });
      }
    } else if (user.goal === "gain weight") {
      if (user.level === "beginner") {
        dailyCaloriesNeeded += 200;
      } else if (user.level === "Advanced") {
        dailyCaloriesNeeded += 300;
      } else if (user.level === "intermidiare") {
        dailyCaloriesNeeded += 400;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid or undefined activity level",
        });
      }
    }
    const Meals = await MealPlan.find().sort({ createdAt: -1 });

    const calorieRange = 500;
    // const filteredMeals = Meals.filter(
    //   (meal) =>
    //     Math.abs(meal.dailyMeals.calories - dailyCaloriesNeeded) <= calorieRange
    // );
    const filteredMeals = Meals.filter((mealPlan) =>
      mealPlan.dailyMeals.some(
        (dailyMeal) =>
          Math.abs(dailyMeal.calories - dailyCaloriesNeeded) <= calorieRange
      )
    );

    const responseMeals = filteredMeals.length > 0 ? filteredMeals : Meals;

    return res.status(200).json({ success: true, Meals: responseMeals });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching meals" });
  }
};

const fetchPlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const PlanDetail = await MealPlan.findById(planId);
    return res.status(200).json({ success: true, PlanDetail });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching meals" });
  }
};

const DeleteMealPlan = async (req, res) => {
  const { planId } = req.params;
  try {
    const planToDelete = await MealPlan.findById(planId);

    if (!planToDelete) {
      return res
        .status(404)
        .json({ success: false, type: "error", message: "Plan not found" });
    }

    const filename = planToDelete.thumbnail;
    if (filename) {
      fs.unlink(path.join(__dirname, "../uploads", filename), (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    const deletedPlan = await MealPlan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res
        .status(404)
        .json({
          success: false,
          type: "error",
          message: "Plan not found or already deleted",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        type: "success",
        message: "Plan deleted successfully",
      });
  } catch (err) {
    console.error("Error deleting Plan:", err);
    res
      .status(500)
      .json({ success: false, type: "error", message: "Error deleting Plan" });
  }
};

const deleteMeal = async (req, res) => {
  const { planId, dayIndex, mealId } = req.params; // Assuming these are passed as URL parameters

  try {
    const mealPlan = await MealPlan.findById(planId);

    if (!mealPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Meal plan not found" });
    }

    // Remove the meal from the specified day
    const day = mealPlan.dailyMeals[dayIndex];
    if (!day) {
      return res.status(404).json({ success: false, message: "Day not found" });
    }

    // Find the index of the meal to delete by its ID
    const mealIndex = day.meals.findIndex(
      (meal) => meal._id.toString() === mealId
    );

    if (mealIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Meal not found" });
    }

    // Remove the meal using the found index
    day.meals.splice(mealIndex, 1);

    await mealPlan.save();

    res
      .status(200)
      .json({ success: true, message: "Meal deleted successfully" });
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).json({ success: false, message: "Error deleting meal" });
  }
};

const deleteDay = async (req, res) => {
  const { planId, dayIndex } = req.params; // Assuming these are passed as URL parameters

  try {
    const mealPlan = await MealPlan.findById(planId);

    if (!mealPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Meal plan not found" });
    }

    // Remove the specified day
    mealPlan.dailyMeals.splice(dayIndex, 1);

    await mealPlan.save();

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
    const { planId } = req.params;
    const PlanMeal = await MealPlan.findById(planId);
    const dailyMeals = req.body.dailyMeals
      ? JSON.parse(req.body.dailyMeals)
      : PlanMeal.dailyMeals;

    let updateData = {
      Plan_Name: req.body.Plan_Name ? req.body.Plan_Name : PlanMeal.Plan_Name,
      descriptionP: req.body.descriptionP
        ? req.body.descriptionP
        : PlanMeal.descriptionP,
      totalCalories: req.body.totalCalories
        ? req.body.totalCalories
        : PlanMeal.totalCalories,
      dailyMeals: dailyMeals,
    };

    // If a new thumbnail is uploaded, handle the file and update the thumbnail path
    if (req.file) {
      updateData.thumbnail = req.file.filename;

      // Find the existing meal plan to get the old thumbnail path for deletion

      if (PlanMeal && PlanMeal.thumbnail) {
        fs.unlink(
          path.join(__dirname, "../uploads", PlanMeal.thumbnail),
          (err) => {
            if (err) {
              console.error("Error deleting old thumbnail:", err);
            }
          }
        );
      }
    }

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      planId,
      updateData,
      { new: true }
    );
    if (!updatedMealPlan) {
      return res.status(404).send({ message: "Meal plan not found." });
    }
    console.log(updatedMealPlan);
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).send({ message: "Error updating meal plan." });
  }
};

module.exports = {
  FetchingMeals,
  addMealPlan,
  fetchPlanById,
  FiltredMeals,
  DeleteMealPlan,
  deleteMeal,
  deleteDay,
  UpdatePlan,
};
