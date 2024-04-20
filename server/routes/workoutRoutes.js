const { Router } = require("express");

const router = Router();
const upload = require("../middlewares/multer");
const {
  AddWorkoutPlan,
  fetchWorkoutPlan,
  fetchById,
  deleteworkout,
  deleteExersise,
  UpdatePlan,
  deleteDay,
  FiltredWorkoutPlan
} = require("../controllers/workoutControler");



router.post("/add/workoutPlan", upload.single("thumbnail_W"), AddWorkoutPlan);
router.get("/WorkoutPlans", fetchWorkoutPlan);
router.get("/Workout/:userId",FiltredWorkoutPlan);
router.get("/WorkoutPlans/:workoutId", fetchById);
router.delete("/WorkoutPlans/:workoutId", deleteworkout);
router.delete(
  "/WorkoutPlans/:workoutId/day/:dayIndex/exersise/:exersiseId",
  deleteExersise
);
router.delete("/WorkoutPlans/:workoutId/day/:dayIndex", deleteDay);
router.put(
  "/WorkoutPlans/update/:workoutId",
  upload.single("thumbnail_W"),
  UpdatePlan
);

module.exports = router;
