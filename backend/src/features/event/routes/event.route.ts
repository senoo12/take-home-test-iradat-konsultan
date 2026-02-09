import express from "express";
import { EventController } from "../controllers/event.controller";

export const EventRouter = express.Router();

EventRouter.post("/", EventController.create);
EventRouter.get("/", EventController.getAll);
EventRouter.get("/:id", EventController.getById);
EventRouter.put("/:id", EventController.update);
EventRouter.delete("/:id", EventController.delete);