import express from 'express';
import subscriptionsController from './subscriptionsController';

const router = express.Router();

router.use('/subscriptions', subscriptionsController);

export default router;
