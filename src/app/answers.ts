import express, { Router } from 'express';
import {
  getAnswers, postAnswer, deleteAnswer,
  likeAnswer, unlikeAnswer, reportAnswer,
  getAnswersValidation, postAnswerValidation,
  deleteAnswerValidation, likeAnswerValidation,
  unlikeAnswerValidation, reportAnswerValidation
} from '../middleware';

const router = Router();

router.get('/', getAnswersValidation, getAnswers);
router.post('/', postAnswerValidation, postAnswer);
router.delete('/:answer_id', deleteAnswerValidation, deleteAnswer);
router.patch('/:answer_id/like', likeAnswerValidation, likeAnswer);
router.patch('/:answer_id/unlike', unlikeAnswerValidation, unlikeAnswer);
router.patch('/:answer_id/report', reportAnswerValidation, reportAnswer);

export default router;