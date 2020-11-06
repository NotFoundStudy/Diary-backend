import {
	boardSchema as boardValidation,
	boardCommentsSchema as commentsValidation,
} from '../validation/schema';
import Board from '@db/model/boards';
import winston from '@config/winston';
import BoardComment from '@db/model/boardComments';

export async function createBoard({ data }) {
	const response = {
		status: 300,
		error: '',
		message: '',
		data: {},
	};
	// validation check
	try {
		const value = await boardValidation.validateAsync(data);
		const board = await Board.createBoard(value);
		response.data = board;
	} catch (err) {
		response.error = '0002';
		response.status = 409;
		response.message = 'Server error';
		winston.error(`Create Board Failed... ::: ${err.message}`);
	}
	return response;
}
//_id, boardType, comments, email
export async function createComments({ data }) {
	const response = {
		status: 300,
		error: '',
		message: '',
		data: {},
	};
	try {
		// props의 id는 게시글의 _id
		const value = await commentsValidation.validateAsync(data);
		const comment = await BoardComment.createComments(value);
		
		const id = value._id;
		const newBoard = await Board.getBoardById(id);
		
		const updatedBoard = await newBoard.addComment(comment);
		await updatedBoard.getComments() //await Board.getComments(id)
		
		response.data = updatedBoard;
	} catch (err) {
		response.error = '000??';
		response.status = 409;
		response.message = 'Server error';
		winston.error(`Create Comments Failed... ::: ${err.message}`);
	}
	return response;
}