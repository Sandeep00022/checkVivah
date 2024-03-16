const express = require("express");
const connection = require("./config/config.js");
// const userRouter = require("./routes/user.routes.js");
// const fileRouter = require("./routes/userFiles.routes.js");
const dotenv = require("dotenv");
// const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// Use path.resolve() to ensure __dirname is resolved correctly
// const rootDir = path.resolve();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.use("/api/user", userRouter);
// app.use("/api/file", fileRouter);

// Serve static files from the frontend/dist directory
// app.use(express.static(path.join(rootDir, "frontend", "dist")));

// Route for serving index.html for all other routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(rootDir, "frontend", "dist", "index.html"));
// });

const port = process.env.PORT || 8000;

// Start the server after the database connection is established
connection.then(() => {
  app.listen(port, () => {
    console.log("Server is running on port", port);
    console.log("Connected to Database");
  });
}).catch(error => {
  console.error("Error connecting to database:", error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
