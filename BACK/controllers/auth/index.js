import { register as registerService, confirmationSave, updateRoles } from '@services/auth';
import { sendConfirmationCode } from '@services/utils/Mailer';
import { emailSchema as emailValidation } from '@services/validation/schema';
import User from '@db/model/users';
import ConfirmedCode from '@db/model/confirmedCodes';

import jwt from 'jsonwebtoken';
import winston from '@config/winston';
import { generateToken } from '@lib/token';
require('dotenv').config();

export async function register(req, res) {
	const { body } = req;
	try {
		const response = await registerService({ data: body });
		if (response.error) {
			res.status = response.status;
			res.send(response.message);
			return;
		}
		// jwt.sign('token내용', 'JWT secretkey')
		const { email, name, confirmation, roles, studentId } = response.data;
		const token = jwt.sign(
			JSON.stringify({ email, name, confirmation, roles, studentId }),
			process.env.JWT_SECRET
		);
		res.send({
			data: { email, name, confirmation, roles, studentId },
			token,
			message: 'register success',
		});
	} catch (err) {
		winston.error(`Register Failed... ::: ${err.message}`);
		res.json({
			data: null,
			status: 500,
			error: '1006',
			message: 'register failed',
		});
	}
}

export async function sendConfirmationCodeMail(req, res) {
	try {
		const bearerHeader = req.headers['authorization'];
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		const data = jwt.verify(bearerToken, process.env.JWT_SECRET);

		const emailData = {
			toEmail: data.email,
			subject: `${process.env.WEB_SITE_NAME} 회원가입 인증코드입니다.`,
			html: `인증코드 : ${data.confirmation_code}`,
		};
		const result = await sendConfirmationCode(emailData);
		result && res.json({ message: 'Mail send success!' });
	} catch (err) {
		winston.error(`sendConfirmationCodeMail Failed... ::: ${err.message}`);
		res.json({
			data: null,
			status: 500,
			error: '1002',
			message: 'Send Confirmation-code mail failed',
		});
	}
}

// updating
export async function sendConfirmationMail(req, res) {
	try {
		const { email } = req.body;
		const validationed = await emailValidation.validateAsync({email});
		
		const { DOMAIN, JWT_SECRET } = process.env;
		const token = jwt.sign({ email: validationed.email }, JWT_SECRET);

		let confirmedCode = await ConfirmedCode.create({ email });

		let linkTo = `${DOMAIN}/api/auth/confirmation/${confirmedCode.confirmation_code}`;

		const emailData = {
			toEmail: email,
			subject: `${process.env.WEB_SITE_NAME} 회원가입 인증코드입니다.`,
			html: `인증코드 : <a href="${linkTo}">링크를 클릭하면 회원가입 창으로 이동합니다.</a> <br/> <p>(해당 링크는 2분후에 만료됩니다.)</p>`,
		};
		const result = await sendConfirmationCode(emailData);
		result && res.json({ message: 'Mail send success!' });
	} catch (err) {
		winston.error(`sendConfirmationCodeMail Failed... ::: ${err.message}`);
		res.json({
			data: null,
			status: 500,
			error: '1002',
			message: 'Send Confirmation mail failed',
		});
	}
}
export async function confirmed(req, res) {
	try {
		const { code } = req.params;
		const { DOMAIN, JWT_SECRET } = process.env;
		const confirmedCode = await ConfirmedCode.getConfirmedCodeByCode({ confirmation_code: code });
		
		if (confirmedCode) {
			res.json({
				message: 'confirmed mail success!',
				data: { email: confirmedCode.email },
			});
		} else {
			res.json({
				data: null,
				status: 500,
				error: '1002',
				message: 'is not valid confirmation code',
			});
		}
	} catch (err) {
		winston.error(`sendConfirmationCodeMail Failed... ::: ${err.message}`);
		res.json({
			data: null,
			status: 500,
			error: '1002',
			message: 'Send Confirmation-code mail failed',
		});
	}
}

export async function updateConfirmationCode(req, res) {
	const { body } = req;
	const bearerHeader = req.headers['authorization'];
	const bearer = bearerHeader.split(' ');
	const bearerToken = bearer[1];
	const userData = jwt.verify(bearerToken, process.env.JWT_SECRET);
	// User
	try {
		const response = await confirmationSave({
			email: userData.email,
			confirmation_code: body.confirmation_code,
		});
		res.json(response);
	} catch (err) {
		winston.error(`Update Confirmation-code Failed... ::: ${err.message}`);
		res.json({
			data: null,
			status: 500,
			error: '1003',
			message: 'update Confirmation-code fail',
		});
	}
}

export function updateProfile(req, res) {
	const { body, user } = req;
	try {
		let updatedData = User.updateProfile(user, body);
		res.json({
			data: updatedData,
			message: 'update complete',
		});
	} catch (err) {
		res.json({
			data: null,
			status: 500,
			error: '1003',
			message: 'update fail',
		});
	}
}
export function checkEmail(req, res) {
	const { email } = req.body;

	User.checkEmail({ email })
		.then((duplicate) => {
			if (duplicate) {
				res.json({
					data: null,
					message: 'email is duplicated',
				});
			} else {
				res.json({
					data: null,
					message: 'not duplicated',
				});
			}
		})
		.catch((err) => {
			res.json({
				data: null,
				status: 500,
				error: '1004',
				message: 'email checking error',
			});
		});
}

export function checkStudentId(req, res) {
	const { studentId } = req.body;

	User.checkStudentId({ studentId })
		.then((duplicate) => {
			if (duplicate) {
				res.json({
					data: null,
					message: 'studentId is duplicated',
				});
			} else {
				res.json({
					data: null,
					message: 'not duplicated',
				});
			}
		})
		.catch((err) => {
			res.json({
				data: null,
				status: 500,
				error: '1005',
				message: 'studentId checking error',
			});
		});
}

export async function changeRoles(req, res) {
	const { email, roles } = req.body;
	try {
		let response = await updateRoles({ email, roles });
		res.json({ message: response });
	} catch (err) {
		res.json({
			data: null,
			status: 500,
			error: '1007',
			message: 'roles update fail',
		});
	}
}