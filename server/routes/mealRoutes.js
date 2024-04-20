const { Router } = require("express");
const router = Router();
const upload = require("../middlewares/multer");
const {
  FetchingMeals,
  addMealPlan,
  fetchPlanById,
  FiltredMeals,
  DeleteMealPlan,
  deleteMeal,
  deleteDay,
  UpdatePlan
} = require("../controllers/mealControler");



router.get("/MealPlans", FetchingMeals);
router.post("/Meal/Add", upload.single("thumbnail"), addMealPlan);
router.get("/MealPlan/:planId", fetchPlanById);
router.get("/MealsPlans/:userId", FiltredMeals);
router.delete("/MealsPlan/:planId", DeleteMealPlan);
router.delete("/MealPlan/:planId/day/:dayIndex", deleteDay);
router.delete("/MealPlan/:planId/day/:dayIndex/meal/:mealId", deleteMeal);
router.put("/MealPlan/update/:planId",upload.single("thumbnail"), UpdatePlan);

module.exports = router;
