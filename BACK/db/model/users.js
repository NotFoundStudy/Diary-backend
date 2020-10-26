import mongoose from 'mongoose';
import crypto from 'crypto';
import token from '@lib/token';
const { PASSWORD_HASH_KEY: secret } = process.env;

// 사용법: console.log(hash('1234'));
const hash = (password) => crypto.createHmac('sha256', secret).update(password).digest('hex');

const { Schema } = mongoose;

let User = new Schema(
	{
		email: { type: String, unique: true, trim: true },
		studentId: { type: String, trim: true, required: true },
		name: { type: String, trim: true, required: true },
		password: { type: String, trim: true, required: true },
		roles: [String],
		confirmation_code: String,
		confirmed: { type: Boolean, default: false },
		facebook: {
			id: String,
			token: String,
			email: String,
			name: String,
		},
		google: {
			id: String,
			token: String,
			email: String,
			name: String,
		},
	},
	{ timestamps: true }
);

// 이메일 찾기
User.statics.findByEmail = function (email) {
	return this.findOne({ email });
};

// 닉네임 찾기
User.statics.findByStudentId = function (studentId) {
	return this.findOne({ studentId });
};

// 이메일과 닉네임 찾기
User.statics.findExistancy = function ({ email, studentId }) {
	return this.findOne({
		$or: [{ email }, { studentId }],
	});
};

User.statics.login = async function ({ email, password }) {
	const userData = await this.findOne({ $or: [{ email }, { studentId: email }] });
	const isAuthenticated = userData.validatePassword(password);
	if (isAuthenticated) return userData;
	return false;
};

// local 회원가입
User.statics.localRegister = function ({ email, password, studentId, name }) {
	const user = new this({
		email,
		password: hash(password),
		studentId,
		name,
		confirmation_code: Math.random().toString(36).substr(2, 11),
	});

	user.save();
	return user;
};

//프로필 수정
User.statics.updateProfile = function (user, body) {
	const { name, password } = body;
	if (name) user.name = name;
	if (password) user.password = password;
	user.save();
	return user;
};

User.statics.checkEmail = async function ({ email }) {
	let duplicate = null;
	await this.findOne({ email })
		.then((result) => {
			if (result.length != 0) {
				duplicate = true;
			}
		})
		.catch((err) => {
			duplicate = false;
		});

	return duplicate;
};

User.statics.checkStudentId = async function ({ studentId }) {
	let duplicate = null;
	await this.findOne({ studentId })
		.then((result) => {
			if (result.length != 0) {
				duplicate = true;
			}
		})
		.catch((err) => {
			duplicate = false;
		});

	return duplicate;
};

// 해당 유저의 비밀번호 일치여부 체크
User.methods.validatePassword = function (password) {
	const hashed = hash(password);
	return this.password === hashed;
};

// 유저값 변경
User.methods.updateField = function (key, value) {
	this[key] = value;
	this.save();
	return this;
};

export default mongoose.model('User', User);