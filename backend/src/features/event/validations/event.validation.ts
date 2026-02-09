import Joi from "joi";

export const baseSchema = {
    name_event: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().required(),
    date: Joi.date().required(),
}

export class EventValidation {
    static readonly CREATE = Joi.object(baseSchema);
    static readonly UPDATE = Joi.object({
        id: Joi.string().uuid().required(),
    }).concat(Joi.object(baseSchema));
    static readonly GET_BY_ID = Joi.object({
        id: Joi.string().uuid().required(),
    })
}

