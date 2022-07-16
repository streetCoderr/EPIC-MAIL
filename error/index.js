const BadRequestError = require("./badRequestError")
const NotFoundError = require("./notFoundError")
const UnauthenticatedError = require("./unauthenticatedError")
const UnauthorizedError = require("./unauthorizedError")
const CustomError = require("./customError")

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  CustomError,
}