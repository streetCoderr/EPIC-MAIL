import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorToHandle = {
    message: err.message || "Something went wrong. Please try again later",
    statusCode: err.statusCode || 500,
  };

  if (err.name === "ValidationError") {
    errorToHandle.message = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(", ");
    errorToHandle.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    errorToHandle.message = `The values you entered for the properties: [${Object.keys(
      err.keyValue
    )}], have been taken already, please choose another value`;
    errorToHandle.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    errorToHandle.message = `No item found with id : ${err.value}`;
    errorToHandle.statusCode = StatusCodes.NOT_FOUND;
  }

  return res
    .status(errorToHandle.statusCode)
    .json({ msg: errorToHandle.message });
};

export default errorHandler;
