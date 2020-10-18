import express from 'express';
import passport from 'passport';
import AuthTokenController from '@services/utils/AuthTokenController';
import { register } from '@controllers/auth';
const router = express.Router();

// api/auth/


// 인증절차가 필요한 라우팅은 아래소스를 참고
/*
 *   router.put('/user', passport.authenticate('jwt', {session: false}), (req, res) => {res.send("SUCCESS!!")});
 */

router.post('/login',AuthTokenController.create);

router.post('/register', register);

router.put('/user', passport.authenticate('jwt', {session: false}), (req, res) => {res.send("SUCCESS!!")});

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