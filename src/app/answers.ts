import express, { Router } from 'express';
import {
  getAnswers, postAnswer, deleteAnswer,
  likeAnswer, unlikeAnswer, reportAnswer
} from '../middleware';

const router = Router();

router.get('/', getAnswers);
router.post('/', postAnswer);
router.delete('/:answer_id', deleteAnswer);
router.post('/:answer_id/like', likeAnswer);
router.put('/:answer_id/unlike', unlikeAnswer);
router.post('/:answer_id/report', reportAnswer);

export default router;