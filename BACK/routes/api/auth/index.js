import express from 'express';
import passport from 'passport';
import AuthTokenController from '@services/utils/AuthTokenController';
import winston from '@config/winston';
import { register, sendConfirmationCodeMail, updateConfirmationCode, updateProfile, checkEmail, checkStudentId, changeRoles, confirmed, sendConfirmationMail } from '@controllers/auth';

const router = express.Router();
// api/auth/


// 인증절차가 필요한 라우팅은 아래소스를 참고
/*
 *   router.put('/user', passport.authenticate('jwt', {session: false}), (req, res) => {res.send("SUCCESS!!")});
 */

router.post('/login',AuthTokenController.create);

router.post('/register', register);

router.put('/user', passport.authenticate('jwt', {session: false}), updateProfile);

router.delete('/user', () => {});

// 이메일 인증코드 생성
// router.get('/confirmation-code', passport.authenticate('jwt', {session: false}), sendConfirmationCodeMail);
router.post('/confirmation', sendConfirmationMail);

// 이메일 인증
// router.put('/confirmation-code', passport.authenticate('jwt', {session: false}), updateConfirmationCode);
router.get('/confirmation/:code', confirmed);

// 가입시 메일 중복체크
router.post('/checkEmail', checkEmail);

// 가입시 학번 중복체크
router.post('/checkStudentId', checkStudentId)

// 권한 수정
router.post('/changeRoles', passport.authenticate('jwt', {session: false}), changeRoles)

// 패스워드 초기화(메일로 초기화 번호발송)
router.post('/find/reset-password', () => {})

// export default router;
module.exports = router;