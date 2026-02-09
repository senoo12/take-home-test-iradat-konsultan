import Joi from "joi";

export class Validation {
  static validate<T>(schema: Joi.ObjectSchema, data: T): T {
    const { error, value } = schema.validate(data, { 
        abortEarly: false, 
        stripUnknown: false 
    });

    if (error) {
      (error as any).isJoi = true; 
      throw error;
    }

    return value;
  }
}