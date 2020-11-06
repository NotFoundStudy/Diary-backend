import express from 'express';
import passport from 'passport';
import { createBoard, updateComments, createComments, deleteComments, showBoards, showComments} from '@controllers/board';
import winston from '@config/winston';

const router = express.Router();
// api/board/


// 인증절차가 필요한 라우팅은 아래소스를 참고
/*
 *   router.put('/user', passport.authenticate('jwt', {session: false}), (req, res) => {res.send("SUCCESS!!")});
 */

router.get('/',() => {});

router.post('/create-board', passport.authenticate('jwt', {session: false}), createBoard);

router.put('/', passport.authenticate('jwt', {session: false}), () => {});

router.get('/show-boards', passport.authenticate('jwt', {session: false}), showBoards);

router.get('/show-comments', passport.authenticate('jwt', {session: false}), showComments);
// searching

// comment 남기기
router.post('/create-comments', passport.authenticate('jwt', {session: false}), createComments);

// comment 수정하기
// router.post('/upodateComments', passport.authenticate('jwt', {session: false}), updateComments);

// comment 삭제하기
// router.post('/deleteComments', passport.authenticate('jwt', {session: false}), deleteComments);

module.exports = router;