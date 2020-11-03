import mongoose from 'mongoose';
import crypto from 'crypto';
import token from '@lib/token';
const { PASSWORD_HASH_KEY: secret } = process.env;

// 사용법: console.log(hash('1234'));
const hash = (password) => crypto.createHmac('sha256', secret).update(password).digest('hex');

const { Schema } = mongoose;

let ConfirmedCode = new Schema(
	{
		confirmation_code: String,
		email: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);
ConfirmedCode.index({createdAt: 1},{expireAfterSeconds: 3600});

ConfirmedCode.statics.create = function ({ email }) {
	const confirmedCode = new this({
		confirmation_code: Math.random().toString(36).substr(2, 11),
		email,
	});
	return confirmedCode.save();
};

ConfirmedCode.statics.getConfirmedCodeByCode = function ({confirmation_code, option}) {
	return this.findOne({ confirmation_code }, option ? option : null);
};
export default mongoose.model('ConfirmedCode', ConfirmedCode);