const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name_Ex: { type: String, required: true },
  description_Ex: { type: String, required: true },
  intensity: { type: String, required: false },
  videoUrl: { type: String, required: false },
  videoFile: { type: String, required: false },
});

const dailyExerciseSchema = new Schema({
  day: { type: Number, required: true },
  exercises: [exerciseSchema],
  level: {
    type: String,
    required: false,
    enum: ["normal", "high", "very_high"],
  },
});

const programSchema = new Schema({
  nameOfprogram: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail_W: { type: String, required: true },
  gender : { type: String , enum: [ 'Male', 'Female' ] },
  category : { type: String, enum: [ 'beginner', 'middle', 'advanced', 'professional'] },
  dailyExercises: [dailyExerciseSchema],
});

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
