require('dotenv').config();
import nodemailer from 'nodemailer';

// nodemailer Transport 생성
const transporter = nodemailer.createTransport({
	service: 'gmail',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		// 이메일을 보낼 계정 데이터 입력
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASSWORD,
	},
});
const emailOptions = ({ toEmail, subject, html }) => ({
	// 옵션값 설정
	from: process.env.MAILER_EMAIL,
	to: toEmail,
	subject,
	html,
});

export function sendConfirmationCode({ toEmail, subject, html }) {
	const option = emailOptions({ toEmail, subject, html })
	return transporter.sendMail(option); //전송
}