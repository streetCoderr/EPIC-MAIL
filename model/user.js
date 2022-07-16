const mongoose = require("mongoose")
const { default: {isAlpha, isStrongPassword, isEmail, isAlphanumeric} } = require("validator")

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 50,
    required: [true, "please provide your first name"],
    validate: {
      validator: isAlpha,
      message: props => `${props.value} is not a valid name`
    }
  },
  lastName: {
    type: String,
    maxlength: 50,
    required: [true, "please provide your last name"],
    validate: {
      validator: isAlpha,
      message: props => `${props.value} is not a valid name`
    }
  },
  userName: {
    type: String,
    maxlength: 50,
    minlength: 2,
    required: [true, "please provide a username"],
    validate: {
      validator: function (str) {
        return isAlphanumeric(str, 'en-US', {ignore: "_"})
      },
      message: props => `${props.value} is not a valid username. Only alphabets, numbers and underscores are permissible`
    },
  },
  email: {
    type: String,
    maxlength: 50,
    required: [true, "please provide your email address"],
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    }
  },
  password: {
    type: String,
    maxlength: 50,
    required: [true, "please provide a password"],
    validate: {
      validator: isStrongPassword,
      message: "You must provide a minimum of 8 characters with at least one uppercase letter, one lowercase letter, one number and one symbol"
    },
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
})

module.exports = mongoose.model('User', UserSchema)