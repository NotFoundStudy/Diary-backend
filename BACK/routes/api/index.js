import express from 'express';
import auth from './auth'
const router = express.Router();

// api/

router.get('/', (req, res)=>res.send("Hello api"));
router.use('/auth', require('./auth'));

// export default router;
module.exports = router;