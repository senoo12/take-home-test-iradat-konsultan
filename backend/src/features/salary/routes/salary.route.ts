import express from "express";
import { SalaryController } from "../controllers/salary.controller";

export const SalaryRouter = express.Router();

SalaryRouter.get("/", SalaryController.getAll);
SalaryRouter.get("/:id", SalaryController.getById);
SalaryRouter.patch("/:id", SalaryController.update);
SalaryRouter.get("/consoler/:id_consoler", SalaryController.getTotalSalary)