import { Router } from "express";
import { ConsolerRouter } from "../../features/consoler/routes/consoler.route";
import { EventRouter } from "../../features/event/routes/event.route";
import { AttendanceRouter } from "../../features/attendance/routes/attendance.route";
import { SalaryRouter } from "../../features/salary/routes/salary.route";

const ApiRouter = Router();

ApiRouter.use("/consoler", ConsolerRouter);
ApiRouter.use("/event", EventRouter);
ApiRouter.use("/attendance", AttendanceRouter);
ApiRouter.use("/salary", SalaryRouter);

export default ApiRouter;