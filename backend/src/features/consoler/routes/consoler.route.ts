import express from "express";
import { ConsolerController } from "../controllers/consoler.controller";
export const ConsolerRouter = express.Router();

ConsolerRouter.post("/", ConsolerController.create);
ConsolerRouter.get("/", ConsolerController.getAll);
ConsolerRouter.get("/:id", ConsolerController.getById);
ConsolerRouter.put("/:id", ConsolerController.update);
ConsolerRouter.delete("/:id", ConsolerController.delete);