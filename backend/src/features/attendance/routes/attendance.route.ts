import express from "express";
import { AttendanceController } from "../controllers/attendance.controller";

export const AttendanceRouter = express.Router();

AttendanceRouter.post("/", AttendanceController.create);
AttendanceRouter.get("/", AttendanceController.getAll);
AttendanceRouter.get("/:id", AttendanceController.getById);
AttendanceRouter.put("/:id", AttendanceController.update);
AttendanceRouter.delete("/:id", AttendanceController.delete);