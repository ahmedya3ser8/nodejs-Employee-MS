import { NextFunction, Request, Response } from "express";

import ApiError from "../utils/apiError";

const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    sendErrorProd(error, res);
  }
}

const handleCastErrorDB = (err: any) => {
  return new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
}

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}

export default globalError;