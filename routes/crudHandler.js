// dependencies
const express = require("express");
const mongoose = require("mongoose");
// application router
const router = express.Router();
// application module
const crudSchema = require("../schemas/crudSchema");
const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");

const CRUD = new mongoose.model("CRUD", crudSchema);
const User = new mongoose.model("User", userSchema);

// read all data
router.get("/", checkLogin, async (req, res) => {
  try {
    let result = await CRUD.find({user:req.userId})
      .populate("user","name username -_id")
      .select({
        __v: 0,
      });
    // .limit(3);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});

// read active data
router.get("/active", async (req, res) => {
  try {
    const crud = new CRUD();
    const result = await crud.findActive();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});

// read search data
router.get("/:search", async (req, res) => {
  const searchQuery = req.params.search;
  try {
    let result = await CRUD.findByQuery(searchQuery);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "There was a server side error" });
  }
});

// read single data by id
router.get("/:id", async (req, res) => {
  try {
    let result = await CRUD.find({ _id: req.params.id });

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});

// create data
router.post("/", checkLogin, async (req, res) => {
  try {
    const newCRUD = new CRUD({ ...req.body, user: req.userId });
     const data =  await newCRUD.save();
     await User.updateOne(
       { _id: req.userId },
       {
         $push: {
           cruds: data._id
         },
       }
     );

    res.status(200).json({ message: "Data created succesfully" });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});
// create mutiple data
router.post("/all", async (req, res) => {
  try {
    await CRUD.insertMany(req.body);
    res.status(200).json({ message: "Data created succesfully" });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});
// update data
router.put("/:id", async (req, res) => {
  try {
    const result = await CRUD.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});
// delete single data by id
router.delete("/:id", async (req, res) => {
  try {
    await CRUD.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});

module.exports = router;
