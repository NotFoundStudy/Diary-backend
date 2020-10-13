import express from 'express';
import passport from 'passport';
import AuthTokenController from '../../services/auth/AuthTokenController'
const router = express.Router();

router.get(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		successMessage: true,
		failureMessage: {
			err_code: 0001,
			message: 'Login fail'
		},
	})
);

router.post('/register', () => {});

router.put('/user', () => {});

router.del('/user', () => {});

router.put('/getToken', () => {});

// 이메일 인증코드 생성
router.post('/confirmation-code', () => {});

// 이메일 인증
router.put('/confirmation-code', () => {});

// jwt 토큰 발급
router.post('/publish',AuthTokenController.create);