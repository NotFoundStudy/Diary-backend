import joi from 'joi';

const Joi = require('joi');

export const userSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
	studentId: Joi.string().alphanum().min(3).max(30).required(),
	name: Joi.string().required(),
	confirmation_code: Joi.string(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
	repeat_password: Joi.ref('password'),
	access_token: [Joi.string(), Joi.number()],
}).xor('password', 'access_token');
// .with('password', 'repeat_password');