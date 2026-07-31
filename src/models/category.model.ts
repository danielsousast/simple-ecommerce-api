import mongoose from "mongoose";

export interface ICategory extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;