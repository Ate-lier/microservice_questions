import express, { Router } from 'express';
import {
  getAnswers, postAnswer, deleteAnswer,
  likeAnswer, unlikeAnswer, reportAnswer
} from '../middleware';

const router = Router();

router.get('/answers', getAnswers);
router.post('/answers', postAnswer);
router.delete('/answers/:answer_id', deleteAnswer);
router.post('/answers/:answer_id/like', likeAnswer);
router.put('/answers/:answer_id/unlike', unlikeAnswer);
router.post('/answers/:answer_id/report', reportAnswer);

export default router;