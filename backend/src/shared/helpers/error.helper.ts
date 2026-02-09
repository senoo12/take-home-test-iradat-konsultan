import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import Joi from "joi";
import { HttpError } from "./http.error.helper";
import { ResponseHelper } from "./response.helper";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.error("=== ERROR LOG START ===");
  console.error("Type:", err.constructor.name);
  console.error("Message:", err.message);
  console.error("=== ERROR LOG END ===");

  if (err instanceof Joi.ValidationError || err.isJoi || err.name === 'ValidationError') {
    const messages = err.details?.map((d: any) => d.message).join(", ") || err.message;
    return ResponseHelper.error(res, `Validasi Gagal: ${messages}`, 400);
  }

  if (err instanceof HttpError || (err.statusCode && typeof err.statusCode === 'number')) {
    const status = err.statusCode || 400;
    return ResponseHelper.error(res, err.message, status);
  }

  if (err.code === 'P2002') {
    return ResponseHelper.error(res, "Data sudah ada di database (Conflict)", 409);
  }

  const errorMessage = process.env.NODE_ENV === 'development' ? err.message : "Internal Server Error";
  return ResponseHelper.error(res, errorMessage, 500);
};