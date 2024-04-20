const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mealRoutes = require("./routes/mealRoutes");
const userRoutes= require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const productRoutes = require("./routes/productRoutes");

require("dotenv").config();


app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true,
};


app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));



app.use("/api/", mealRoutes);
app.use("/api/", userRoutes);
app.use("/api/", workoutRoutes);
app.use("/api/", productRoutes);

mongoose
  .connect(
    "mongodb+srv://achraf:nkyLW9nwuPrGcHIG@clustergym.2zulqzs.mongodb.net/?retryWrites=true&w=majority&appName=ClusterGym"
  )
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });


