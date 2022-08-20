import CustomError from "./customError";
import {StatusCodes} from "http-status-codes";

export default class UnauthenticatedError extends CustomError {
  statusCode: number;
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}
