import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../../shared/helpers/response.helper";
import { getSingleParam } from "../../../shared/helpers/request.helper";
import { SalaryService } from "../services/salary.service";

export class SalaryController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { data, totalItems } = await SalaryService.getAll(page, limit);

        return ResponseHelper.paginate(
          res,
          "Sukses mengambil data semua salary",
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

        const result = await SalaryService.getById(id);
        return ResponseHelper.success(res, "Sukses mengambil data salary", result);
      } catch (err) {
        next(err);
      }
    }  

    static async getTotalSalary(req: Request<{ id_consoler: string }>, res: Response, next: NextFunction) {
      try {
          const { id_consoler } = req.params;

          const result = await SalaryService.getTotalSalary(id_consoler);

          res.status(200).json({
              data: result
          });
      } catch (e) {
          next(e);
      }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
      try {
        const id = getSingleParam(req.params.id)
        if (!id) {
          return ResponseHelper.error(res, "ID parameter wajib diisi!", 400);
        }
        const result = await SalaryService.update({
          id,
          ...req.body,
        });
        return ResponseHelper.success(res, "Sukses mengupdate data salary", result);
      } catch (err) {
        next(err);
      } 
    }
}