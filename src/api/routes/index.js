import { Router } from 'express';

import postRoute from './post';

const router = Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/posts', postRoute);

module.exports = router;