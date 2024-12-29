const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const phoneValidator = {
  validator: function (value) {
    return /^[1-9]\d{9}$/.test(value);
  },
  message: (props) => `${props.value} is not a valid Phone number!`,
};

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: phoneValidator,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(user.password, salt);
    user.password = hashedPass;
    next();
  } catch (err) {
    return next(err);
  }
});
userSchema.methods.comparePass = async function (candidatePass) {
  try {
    return await bcrypt.compare(candidatePass, this.password);
  } catch (err) {
    console.log(err);
  }
};
module.exports = mongoose.model("User", userSchema);
