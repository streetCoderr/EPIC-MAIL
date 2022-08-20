import { Response, NextFunction } from "express";
import { Req } from "../interface";
const asyncErrorCatcher = (fn: any) => {
  return async (req: Req, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncErrorCatcher;
