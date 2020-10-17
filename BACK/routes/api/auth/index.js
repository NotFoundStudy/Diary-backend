import express from 'express';
import passport from 'passport';
import AuthTokenController from '../../../services/utils/AuthTokenController';
import { register } from '../../../controllers/auth';
const router = express.Router();

// api/auth/

// router.post(
// 	'/login',
// 	passport.authenticate('local', {
// 		successRedirect: '/',
// 		failureRedirect: '/login',
// 		successMessage: true,
// 		failureMessage: {
// 			err_code: 1,
// 			message: 'Login fail',
// 		},
// 		session: false,
// 	})
// );
router.post('/login',AuthTokenController.create);

router.post('/register', register);

router.put('/user', () => {});

router.delete('/user', () => {});

router.put('/getToken', () => {});

// 이메일 인증코드 생성
router.post('/confirmation-code', () => {});

// 이메일 인증
router.put('/confirmation-code', () => {});

// jwt 토큰 발급
router.post('/publish', AuthTokenController.create);

// export default router;
module.exports = router;