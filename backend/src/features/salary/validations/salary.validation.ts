import { SalaryStatus } from "@prisma/client";
import Joi from "joi";

export const baseSchema = {
    id_consoler: Joi.string().uuid().required(),
    id_attendance: Joi.string().uuid().required(),
}

export class SalaryValidation {
    static readonly CREATE = Joi.object(baseSchema);
    static readonly UPDATE_STATUS = Joi.object({
        id: Joi.string().uuid().required(),
        status: Joi.string().valid("PENDING", "PAID").required()
    });
    static readonly GET_BY_ID = Joi.object({
        id: Joi.string().uuid().required(),
    });
    static readonly GET_TOTAL_SALARY = Joi.object({
        id_consoler: Joi.string().uuid().required()
    })
}

