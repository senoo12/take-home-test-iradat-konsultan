import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../../../shared/helpers/response.helper";
import { ConsolerService } from "../services/consoler.service";
import { getSingleParam } from "../../../shared/helpers/request.helper";

export class ConsolerController {
    static async create(req: Request, res: Response, next: NextFunction) {
      try {
        const result = await ConsolerService.create(req.body);
        return ResponseHelper.success(res, "Sukses menambah data consoler", result);
        } catch (err) {
        next(err);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { data, totalItems } = await ConsolerService.getAll(page, limit);

        return ResponseHelper.paginate(
          res,
          "Sukses mengambil data semua consoler",
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

        const result = await ConsolerService.getById(id);
        return ResponseHelper.success(res, "Sukses mengambil data consoler", result);
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
        const result = await ConsolerService.update({
          id,
          ...req.body,
        });
        return ResponseHelper.success(res, "Sukses mengupdate data consoler", result);
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
        await ConsolerService.delete(id);
        return ResponseHelper.success(res, "Sukses menghapus data consoler");
      } catch (err) {
        next(err);
      } 
    }
}