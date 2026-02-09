import { NextFunction, Response } from "express";
import Joi from "joi";
import { ResponseHelper } from "../helpers/response.helper";
import { HttpError } from "../helpers/http.error.helper";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error Log:", err);

  if (err instanceof Joi.ValidationError || err.isJoi) {
    const messages = err.details.map((d: any) => d.message).join(", ");
    
    return ResponseHelper.error(
      res, 
      `Validasi Gagal: ${messages}`, 
      400
    );
  }

  if (err instanceof HttpError) {
    return ResponseHelper.error(res, err.message, err.statusCode);
  }

  const errorMessage = process.env.NODE_ENV === 'development' ? err.message : "Internal Server Error";
  return ResponseHelper.error(res, errorMessage, 500);
}