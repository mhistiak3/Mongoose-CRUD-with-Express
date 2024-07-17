// dependencies
const express = require("express");
const mongoose = require("mongoose");
// application module 
const crudHandler = require("./routes/crudHandler");

// express app init
const app = express();
// application middleware
app.use(express.json());

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/CRUD")
  .then(() => console.log("connect succesfully"))
  .catch((err) => console.log(err))

// Application Routes middleware
app.use("/crud", crudHandler);
app.get("/", (req, res) => {
  res.json({ name: "Mongoose CRUD Application" });
});

// Handle Error
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message });
});

// Server listen
app.listen(3000, () => {
  console.log(`Server listening: http://localhost:3000`);
});
