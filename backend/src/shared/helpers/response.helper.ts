import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    message = "Success",
    data?: T,
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    } as ApiResponse<T>);
  }

  static paginate<T>(
    res: Response,
    message = "Success",
    data: T[],
    page: number,
    limit: number,
    totalItems: number,
    statusCode = 200
  ) {
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    } as ApiResponse<T[]>);
  }

  static error(
    res: Response,
    message = "Error",
    statusCode = 500
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}