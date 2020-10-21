import { register as registerService, confirmationSave, updateRoles } from '@services/auth';
import { sendConfirmationCode } from '@services/utils/Mailer';
import User from '@db/model/users';
import jwt from 'jsonwebtoken';
import winston from '@config/winston';
require('dotenv').config();

export function register(req, res) {
	const { body } = req;
	registerService({ data: body })
		.then((response) => {
			if (response.error) {
				res.status = response.status;
				res.send(response.message);
				return;
			}
			res.send(response.data);
		})
		.catch((err) => {
			winston.error(`Register Failed... ::: ${err.message}`);
			res.json({
				data: null,
				status: 500,
				error: '1006',
				message: 'register failed',
			});
		});
}

export function sendConfirmationCodeMail(req, res) {
	const bearerHeader = req.headers['authorization'];
	const bearer = bearerHeader.split(' ');
	const bearerToken = bearer[1];
	const data = jwt.verify(bearerToken, process.env.JWT_SECRET);

	const emailData = {
		toEmail: data.email,
		subject: `${process.env.WEB_SITE_NAME} 회원가입 인증코드입니다.`,
		html: `인증코드 : ${data.confirmation_code}`,
	};
	sendConfirmationCode(emailData)
		.then((data) => {
			res.json({
				message: 'Mail send success!',
			});
		})
		.catch((err) => {
			winston.error(`sendConfirmationCodeMail Failed... ::: ${err.message}`);
			res.json({
				data: null,
				status: 500,
				error: '1002',
				message: 'Send Confirmation-code mail failed',
			});
		});
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

export async function changeRoles (req, res) {
	const { email, roles } = req.body;
	try {
		let response = await updateRoles({ email, roles });
		res.json({ message: response });
	} catch(err) {
		res.json({
			data: null,
			status: 500,
			error: '1007',
			message: 'roles update fail'
		});
		
	}
}