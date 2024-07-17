// dependencies
const express = require("express");
const mongoose = require("mongoose");
// application module
const crudHandler = require("./routes/crudHandler");
const userHandler = require("./routes/userHandler");

// express app init
const app = express();
// application middleware
app.use(express.json());

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/CRUD")
  .then(() => console.log("connect succesfully"))
  .catch((err) => console.log(err));

// Application Routes middleware
app.use("/crud", crudHandler);
app.use("/user", userHandler);

// Routes
app.get("/", (req, res) => {
  res.json({ name: "Mongoose CRUD Application" });
});

// 404 page
app.use((req, res, next) => {
  res.status(404).send("<h1>Page Not Found</h1>");
});

// Handle Error
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: err });
});

// Server listen
app.listen(3000, () => {
  console.log(`Server listening: http://localhost:3000`);
});
