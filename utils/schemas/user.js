const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/).required();
const userNameSchema = joi.string().max(80);
const userEmailSchema = joi.string().email();
const userPhoneNumberSchema = joi.string().max(15);
const userPasswordSchema = joi.string().min(8).max(40);
const userTypeUserSchema = joi.string().valid('admin', 'visit');

const createUserSchema = {
    name: userNameSchema.required(),
    email: userEmailSchema.required(),
    password: userPasswordSchema.required(),
    typeUser: userTypeUserSchema.required(),
    phoneNumber: userPhoneNumberSchema
};

const signInSchema = {
    email: userEmailSchema.required(),
    password: userPasswordSchema.required(),
};

const updateUserSchema = {
    name: userNameSchema,
    email: userEmailSchema,
    typeUser: userTypeUserSchema,
    password: userPasswordSchema,
    phoneNumber: userPhoneNumberSchema
};

module.exports = {
    userIdSchema,
    signInSchema,
    createUserSchema,
    updateUserSchema
}