const mongoose = require("mongoose");

const crudSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
});

// instance method
crudSchema.methods = {
  findActive: () => {
    return mongoose.model("CRUD").find({ status: "active" });
  },
};

// static method
crudSchema.statics = {
  findByQuery: function (searchQuery) {
    let search = new RegExp(String.raw`${searchQuery}`, "g");

    return this.find({ title: search });
  },
};
module.exports = crudSchema;
