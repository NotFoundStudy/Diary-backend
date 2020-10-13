import express from 'express';
import api from './api'

const router = express.Router();
// routes

router.use('/', api);

// export default router;
module.exports = router;