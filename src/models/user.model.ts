import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  city: string;
  state: string;
  postalCode: string;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

// hash the password before saving the user
userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error("Error hashing password");
  }
});

// instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// delete password field from the response
userSchema.methods.toJSON = function () {
  const obj = this.toObject({virtuals: true});
  delete obj.password;
  return obj;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
