import mongoose from 'mongoose';
import crypto from 'crypto';
import token from '@lib/token';
const { PASSWORD_HASH_KEY: secret } = process.env;

// 사용법: console.log(hash('1234'));
const hash = (password) => crypto.createHmac('sha256', secret).update(password).digest('hex');

const { Schema } = mongoose;

let Board = new Schema(
	{
		type: {
			type: String,
			trim: true,
			required: true,
			default: 'free',
		},
		title: {
			type: String,
			trim: true,
			default: '',
		},
		contents: {
			type: String,
			trim: true,
			default: '',
		},
		// 작성자
		email: {
			type: String,
			trim: true,
			required: true,
		},
		tags: {
			type: [],
			default: '',
		},
		isSecret: {
			type: Boolean,
			default: false,
		},
		password: String,
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'BoardComment',
			},
		],
	},
	{ timestamps: true }
);

// create board
Board.statics.createBoard = function ({ type, title, contents, email, tags, isSecret, password }) {
	let newBoardData = {
		type,
		title,
		contents,
		email,
		tags,
	};
	if (isSecret) {
		newBoardData = {
			...newBoardData,
			isSecret,
			password: hash(password),
		};
	}
	return new this(newBoardData).save();
};

// update specific Board
Board.statics.updateBoard = function (_id, data) {
	return this.updateOne({ _id }, { $set: { ...data } });
};

// find specific Board
Board.statics.getBoardById = function (_id, option) {
	return this.findOne({ _id }, option ? option : null);
};

// finds user's boards by email
Board.statics.getBoardsByEmail = function (email, option) {
	return this.find({ email }, option ? option : null);
};

// get boards
Board.statics.getBoards = function (sorts = { createdAt: -1 }, startPage = 1, limit = 15, type) {
	const skip = (startPage - 1) * limit;
	return this.find({ type }).sort(sorts).skip(skip).limit(limit).exec();
};

// finds Searched email

// add comment ( UserComment document 를 넣어줘야 합니다.)
Board.methods.addComment = function (BoardComments) {
	this.comments.push(BoardComments);
	return this.save();
	// return this.updateOne({ _id: id }, { $addToSet: { comments: { $push: BoardComments }}})
};

Board.methods.getComments = function () {
	return this.populate('comments').execPopulate();
}

export default mongoose.model('Board', Board);