const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: false,
    enum: ["Admins", "Users"],
    default: "Users",
  },
  weight: { type: Number, required: false },
  isVerified: { type: Boolean, required: false, default: false },
  // height: { type: Number, required: true },
  age: { type: Number, required: false },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female", "Rather not to say "],
  },
  activityLevel: {
    type: String,
    required: false,
    enum: ["moderate", "active", "very_active"],
  },
  level: {
    type: String,
    required: false,
    enum: ["beginner", "advanced", "intermidiare"],
  },
  goal: {
    type: String,
    required: false,
    enum: ["lose weight", "gain weight"],
  },
  avatar: { type: String, required: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
