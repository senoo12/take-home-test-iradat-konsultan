import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

import apiRoutes from "../routes/api";
import { errorHandler } from "../../shared/helpers/error.helper";

export function createWebApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    console.log("--- REQUEST MASUK ---");
    console.log("Method:", req.method);
    console.log("Content-Type:", req.headers["content-type"]);
    next();
  });
  
  app.use(morgan("dev"));
  app.set("json spaces", 2);

  // Core routes
  app.use("/api", apiRoutes);

  app.use(errorHandler);

  return app;
}