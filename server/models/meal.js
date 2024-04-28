const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const mealSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mealNumber : { type: Number, required: false },
  protein: { type: Number, required: false },
  carbs: { type: Number, required: false },
  fats: { type: Number, required: false },
  
});

const dailyMealSchema = new Schema({
  day: { type: Number, required: true },
  meals: [mealSchema],
  calories: { type: Number, required: true },
  
});

// MealPlan schema to include everything
const mealPlanSchema = new Schema({
  Plan_Name: { type: String, required: true },
  descriptionP: { type: String, required: true },
  thumbnail: { type: String, required: false },
  totalCalories: { type: String, required: false },
  dailyMeals: [dailyMealSchema],
});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

module.exports = MealPlan;
