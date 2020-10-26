import { createBoard as serviceCreateBoard, createComments as serviceCreateComments } from '@services/board';
import Board from '@db/model/boards';
import jwt from 'jsonwebtoken';
import winston from '@config/winston';
import { decodeBearerToken } from '@lib/token';
require('dotenv').config();

export async function createBoard(req, res) {
	const { body } = req;
	const authorization = req.headers['authorization'];
	try {
		const userData = await decodeBearerToken(authorization);
		const response = await serviceCreateBoard({ data: {...body, email: userData.email} });
		if (response.error) {
			res.status = response.status;
			res.send(response.message);
			return;
		}
		const { type, title, contents, tags, isSecret } = response.data;
		res.send({
			data: { type, title, contents, email: userData.email, tags, isSecret },
			message: 'create board success',
		});
	} catch (err) {
		winston.error(`Create Board Failed... ::: ${err.message || err}`);
		res.json({
			data: null,
			status: 500,
			error: '1006',
			message: 'Create board failed',
		});
	}
}

export async function createComments(req, res) {
	const { body } = req;
	const authorization = req.headers['authorization'];
	try {
		const userData = await decodeBearerToken(authorization);
		const response = await serviceCreateComments({ data: { ...body, email: userData.email }})
		if (response.error) {
			res.status = response.status;
			res.send(response.message);
			return;
		}
		const { comments, boardType, email } = response.data;
		res.send({
			data: { comments, boardType, email },
			message: 'create comment success',
		});
	}catch (err) {
		winston.error(`Create Comments Failed... ::: ${err.message || err}`);
		res.json({
			data: null,
			status: 500,
			error: '????',
			message: 'Create comment failed',
		});
	}
}