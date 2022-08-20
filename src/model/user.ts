import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import isAlpha from "validator/lib/isAlpha";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    maxlength: 50,
    required: [true, "please provide your first name"],
    validate: {
      validator: isAlpha,
      message: (props: any) => `${props.value} is not a valid name`,
    },
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    required: [true, "please provide your last name"],
    validate: {
      validator: isAlpha,
      message: (props: any) => `${props.value} is not a valid name`,
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50,
    required: [true, "please provide your email address"],
    validate: {
      validator: isEmail,
      message: (props: any) => `${props.value} is not a valid email address`,
    },
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    validate: {
      validator: isStrongPassword,
      message:
        "You must provide a minimum of 8 characters with at least one uppercase letter, one lowercase letter, one number and one symbol",
    },
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDate: Date,
  passwordToken: String,
  passwordTokenExpirationDate: Date,
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  const isCorrect = await bcrypt.compare(password, this.password);
  return isCorrect;
};

UserSchema.index({ userName: 1, email: 1 }, { unique: true });

export default mongoose.model("User", UserSchema);
