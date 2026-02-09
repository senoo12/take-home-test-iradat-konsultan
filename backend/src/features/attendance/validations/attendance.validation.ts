import { StatusAttendance } from "@prisma/client";
import Joi from "joi";

export const baseSchema = {
    id_event: Joi.string().uuid().required(),
    id_consoler: Joi.string().uuid().required(),
    hours: Joi.number().integer().min(0).optional().allow(null),
    date_attendance: Joi.date().optional().allow(null),
    status_attendance: Joi.string()
            .valid(...Object.values(StatusAttendance))
            .required()
            .messages({
                'any.only': 'Status harus salah satu dari: ' + Object.values(StatusAttendance).join(', ')
            })
}

export class AttendanceValidation {
    static readonly CREATE = Joi.object(baseSchema);
    static readonly UPDATE = Joi.object({
        id: Joi.string().uuid().required(),
    }).concat(Joi.object(baseSchema));
    static readonly GET_BY_ID = Joi.object({
        id: Joi.string().uuid().required(),
    })
}

