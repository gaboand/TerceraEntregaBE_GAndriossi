import mongoose from "mongoose";

const userCollection = "users";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  age: { type: Number, required: true, max: 100 },
  role: { type: String, required: false, max: 100, enum: ['user', 'admin', 'premium'], default: "user" },
  cartId: {type: mongoose.Schema.Types.ObjectId, ref: "carts", required: true},
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
});

UserSchema.pre("find", function (next) {
  this.populate({
      path: "cartId",
      model: "carts"
  }).populate({
      path: "orders",
      model: "orders"
  });
  next();
});

export const UserModel = mongoose.model(userCollection, UserSchema);