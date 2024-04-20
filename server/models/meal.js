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
  totalCalories: { type: String, required: true },
  dailyMeals: [dailyMealSchema],
});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);


// const MealSchema = new Schema({
//   Meal_Name: { type: String, required: true },
//   thumbnail: { type: String, required: true },
//   description: { type: String, required: true },
//   totalCalories: { type: Number, required: true },
//   protein: { type: Number, required: true }, // in grams
//   carbs: { type: Number, required: true }, // in grams
//   fats: { type: Number, required: true }, // in grams

//   // Other fields as necessary
// });

// const Meal = mongoose.model("Meal", MealSchema);

// module.exports = Meal;

// const mealSchema = new Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     totalCalories: { type: Number, required: true },
//     // protein: { type: Number, required: true },
//     // carbs: { type: Number, required: true },
//     // fats: { type: Number, required: true },
//     day: { type: Number, required: true },
//   });

//   // MealPlan schema
//   const mealPlanSchema = new mongoose.Schema({
//     Plan_Name: { type: String, required: true },
//     description: { type: String },
//     thumbnail: { type: String },
//     meals: [mealSchema], // Embeds the meal schema as an array
//   });

//   const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

//   module.exports = MealPlan;



module.exports = MealPlan;
