const express = require("express");
const connection = require("./config/config.js");
const userRouter = require("./routes/user.routes.js");
const fileRouter = require("./routes/userFiles.routes.js");
const dotnev = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotnev.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// __dirname is already globally available in CommonJS modules, so you don't need to declare it.
// Remove the redundant declaration of __dirname
// const __dirname = path.resolve();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRouter);
app.use("/api/file", fileRouter);

// Instead of declaring __dirname, use path.resolve() directly
app.use(express.static(path.resolve(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

const port = process.env.PORT || 8000;

connection.then(() => {
  app.listen(port, () => {
    console.log("Server is running on port", port);
    console.log("connected to Database");
  });
}).catch(error => {
  console.error("Error connecting to database:", error);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
