import express from 'express';
const router = express.Router();
import auth from './auth'
import board from './board'
// api/

router.get('/', (req, res)=>res.send("Hello api"));

router.use('/auth', require('./auth'));

router.use('/board', require('./board'));

// export default router;
module.exports = router;