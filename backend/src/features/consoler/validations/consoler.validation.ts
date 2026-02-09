import Joi from "joi";

export const baseSchema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    rate: Joi.number().integer().min(0).required(),
}

export class ConsolerValidation {
    static readonly CREATE = Joi.object(baseSchema);
    static readonly UPDATE = Joi.object({
        id: Joi.string().uuid().required(),
    }).concat(Joi.object(baseSchema));
    static readonly GET_BY_ID = Joi.object({
        id: Joi.string().uuid().required(),
    })
}

