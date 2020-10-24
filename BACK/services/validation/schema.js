import joi from 'joi';

const Joi = require('joi');
const { EMAIL_DOMAIN } = process.env;

export const userSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['kr', 'com'] } }).pattern(new RegExp(EMAIL_DOMAIN)).required(),
	studentId: Joi.string().alphanum().min(3).max(30).required(),
	name: Joi.string().required(),
	confirmation_code: Joi.string(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
	repeat_password: Joi.ref('password'),
	access_token: [Joi.string(), Joi.number()],
}).xor('password', 'access_token');
// .with('password', 'repeat_password');

export const boardSchema = Joi.object({
	type: Joi.string().alphanum().min(3).max(10).required(),
	title: Joi.string().alphanum().min(0).max(30).required(),
	contents: Joi.string(),
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})
