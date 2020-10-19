import mongoose from 'mongoose';
import crypto from 'crypto';
import token from '@lib/token';
const { PASSWORD_HASH_KEY: secret } = process.env;

// 사용법: console.log(hash('1234'));
const hash = (password) => crypto.createHmac('sha256', secret).update(password).digest('hex');

const { Schema } = mongoose;

let User = new Schema(
	{
		email: { type: String, unique: true },
		studentId: { type: String },
		name: { type: String },
		password: { type: String },
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
	return this.findOne({ displayName });
};

// 이메일과 닉네임 찾기
User.statics.findExistancy = function ({ email, studentId }) {
	return this.findOne({
		$or: [{ email }, { studentId }],
	});
};

User.statics.login = async function({ email, password }) {
	const userData = await this.findOne({ "$or": [{ email }, { studentId: email }] })
	const isAuthenticated = userData.validatePassword(password)
	if(isAuthenticated) return userData
	return false
}

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

// 해당 유저의 비밀번호 일치여부 체크
User.methods.validatePassword = function (password) {
	const hashed = hash(password);
	return this.password === hashed;
};

//프로필 수정
User.statics.updateProfile = function (user, body) {
	const {name, password} = body;
	if ( name != undefined && password != undefined ) {
		user.name = name;
		user.password = password;
	}
	else if ( name != undefined ) {
		user.name = name;
	}
	else {
		user.password = password;
	}
	user.save()
	return user;

};

User.statics.checkDuplicate = async function ({ studentId, email }) {
	let duplicate= null;
	if (studentId != undefined) {
		await this.findOne({studentId: studentId})
		.then((result)=> {
			if (result.length != 0) {
				duplicate = "studentId"
			}
		}).catch((err)=>{
			duplicate = "false"
		})
	}
	else if (email != undefined) {
		await this.findOne({email: email})
		.then((result)=> {
			if (result.length != 0) {
				duplicate = "email"
			}
		}).catch((err)=>{
			duplicate = "false"
		})
	}
	
	return duplicate;
}


export default mongoose.model('User', User);