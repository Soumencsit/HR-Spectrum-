const express = require("express");
require('dotenv').config()
const cors = require("cors");
const app = express();

const connectDB = require("./config/db");
const attendanceRouter = require("./routs/attendanceRoutes");
const employeeRoutes = require("./routs/employeeRoutes");
const leaveRoute = require("./routs/leaveRoute");
const reviewRouter = require("./routs/reviewsRoutes");
const developmentRouter = require("./routs/developmentPlansRoutes");
const goalRouter = require("./routs/goalsRoutes");
// Middleware

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173/",
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads")); // Serve static files from uploads folder

connectDB();

// Routes
app.use("/employees", employeeRoutes);
app.use("/attendance", attendanceRouter);
app.use("/leave", leaveRoute);
app.use("/performance/review", reviewRouter);
app.use("/performance/goal", goalRouter);
app.use("/performance/development", developmentRouter);

const PORT =process.env.PORT||3000||4000||6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
