import mongoose from 'mongoose';
import crypto from 'crypto';
import token from '@lib/token';
const { PASSWORD_HASH_KEY: secret } = process.env;

// 사용법: console.log(hash('1234'));
const hash = (password) => crypto.createHmac('sha256', secret).update(password).digest('hex');

const { Schema } = mongoose;

let BoardComment = new Schema(
	{
		comments: { type: String },
		boardType: { type: String, default: 'free' },
		// 글쓴이
		email: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);

BoardComment.statics.createComments = function ({ boardType, comments, email }) {
	const newboardComments = new this({
		boardType,
		comments,
		email,
	});
	return newboardComments.save();
};

BoardComment.statics.updateComments = function (_id, comments) {
	return this.updateOne({ _id }, { $set: comments });
};

BoardComment.statics.deleteComments = function (_id) {
	return this.deleteOne({ _id });
};

BoardComment.statics.getCommentBtId = function (_id, option) {
	return this.findOne({ _id }, option);
};

// 특정 유저가 남긴 댓글모아보기
BoardComment.statics.findsByEmail = function (email, option) {
	return this.find({ email }, option ? option : null);
};

export default mongoose.model('BoardComment', BoardComment);