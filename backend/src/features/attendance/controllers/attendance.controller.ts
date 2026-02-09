import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../../shared/helpers/response.helper";
import { AttendanceService } from "../services/attendance.service";
import { getSingleParam } from "../../../shared/helpers/request.helper";

export class AttendanceController {
    static async create(req: Request, res: Response, next: NextFunction) {
      try {
        const result = await AttendanceService.create(req.body);
        return ResponseHelper.success(res, "Sukses menambah data attendance", result);
        } catch (err) {
        next(err);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { data, totalItems } = await AttendanceService.getAll(page, limit);

        return ResponseHelper.paginate(
          res,
          "Sukses mengambil data semua attendance",
          data,
          page,
          limit,
          totalItems
        );
      } catch (err) {
        next(err);
      }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
      try {
        const id = getSingleParam(req.params.id)
        if (!id) {
          return ResponseHelper.error(res, "ID parameter wajib diisi!", 400);
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return ResponseHelper.error(res, "ID parameter tidak valid!", 400);
        }

        const result = await AttendanceService.getById(id);
        return ResponseHelper.success(res, "Sukses mengambil data attendance", result);
      } catch (err) {
        next(err);
      }
    }  

    static async update(req: Request, res: Response, next: NextFunction) {
      try {
        const id = getSingleParam(req.params.id)
        if (!id) {
          return ResponseHelper.error(res, "ID parameter wajib diisi!", 400);
        }
        const result = await AttendanceService.update({
          id,
          ...req.body,
        });
        return ResponseHelper.success(res, "Sukses mengupdate data attendance", result);
      } catch (err) {
        next(err);
      } 
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
      try {
        const id = getSingleParam(req.params.id)
        if (!id) {
          return ResponseHelper.error(res, "ID parameter wajib diisi!", 400);
        }
        await AttendanceService.delete(id);
        return ResponseHelper.success(res, "Sukses menghapus data attendance");
      } catch (err) {
        next(err);
      } 
    }
}